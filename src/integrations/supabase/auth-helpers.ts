import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Role, User } from "@/types";

export type AppRole = "athlete" | "organizer" | "institution" | "volunteer" | "scout" | "admin";

export type ProfileRow = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: string | null;
  city_id: string | null;
  area: string | null;
  profile_photo_url: string | null;
  profile_visibility: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ManagedProfile = Pick<
  ProfileRow,
  "id" | "email" | "name" | "role" | "is_active" | "created_at" | "updated_at"
>;

type ProfileVisibility = "private" | "public" | "network";
type VerificationState = "pending" | "verified" | "rejected";
type AuthTable<Row, Required extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};
type AuthProfileTables = {
  profiles: AuthTable<ProfileRow, "id" | "auth_user_id" | "email" | "role">;
  athlete_profiles: AuthTable<
    {
      id: string;
      profile_id: string;
      auth_user_id: string;
      city: string | null;
      area: string | null;
      institution: string | null;
      primary_sport: string | null;
      secondary_sports: string[];
      position: string | null;
      position_group: string | null;
      age_group: string | null;
      bio: string | null;
      date_of_birth: string | null;
      gender: "male" | "female" | "other" | null;
      contact_visibility: string | null;
      profile_visibility: ProfileVisibility;
      verification_status: VerificationState;
      profile_photo_url: string | null;
      created_at: string;
      updated_at: string;
    },
    "id" | "profile_id" | "auth_user_id"
  >;
  organizer_profiles: AuthTable<
    {
      id: string;
      profile_id: string;
      auth_user_id: string;
      organization_name: string;
      organizer_type: string;
      city: string | null;
      area: string | null;
      phone: string | null;
      email: string | null;
      description: string | null;
      verification_status: VerificationState;
      profile_photo_url: string | null;
      created_at: string;
      updated_at: string;
    },
    "id" | "profile_id" | "auth_user_id"
  >;
  institution_profiles: AuthTable<
    {
      id: string;
      profile_id: string;
      auth_user_id: string;
      institution_name: string;
      institution_type: string;
      city: string | null;
      area: string | null;
      address: string | null;
      phone: string | null;
      email: string | null;
      description: string | null;
      verification_status: VerificationState;
      profile_photo_url: string | null;
      created_at: string;
      updated_at: string;
    },
    "id" | "profile_id" | "auth_user_id"
  >;
  volunteer_profiles: AuthTable<
    {
      id: string;
      profile_id: string;
      auth_user_id: string;
      city: string | null;
      area: string | null;
      role: string | null;
      active: boolean;
      profile_photo_url: string | null;
      created_at: string;
      updated_at: string;
    },
    "id" | "profile_id" | "auth_user_id"
  >;
};
type AuthDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & AuthProfileTables;
  };
};
const authSupabase = supabase as SupabaseClient<AuthDatabase>;

function readString(details: Record<string, unknown>, key: string, fallback = "") {
  const value = details[key];
  return typeof value === "string" ? value : fallback;
}

function readStringArray(details: Record<string, unknown>, key: string) {
  const value = details[key];
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function readVerificationState(details: Record<string, unknown>): VerificationState {
  const value = details["verification_status"];
  return value === "verified" || value === "rejected" ? value : "pending";
}

function readProfileVisibility(details: Record<string, unknown>): ProfileVisibility {
  const value = details["profile_visibility"];
  return value === "public" || value === "network" ? value : "private";
}

function readGender(details: Record<string, unknown>): "male" | "female" | "other" {
  const value = details["gender"];
  return value === "female" || value === "other" ? value : "male";
}

export function normalizeRole(role?: string | null): Role {
  switch ((role ?? "").toLowerCase()) {
    case "athlete":
      return "ATHLETE";
    case "organizer":
      return "ORGANIZER";
    case "institution":
      return "COLLEGE";
    case "volunteer":
      return "VOLUNTEER";
    case "scout":
      return "SCOUT";
    case "admin":
      return "ADMIN";
    default:
      return "ATHLETE";
  }
}

export function normalizeRoleForDatabase(role: Role): AppRole {
  switch (role) {
    case "ATHLETE":
      return "athlete";
    case "ORGANIZER":
      return "organizer";
    case "COLLEGE":
      return "institution";
    case "VOLUNTEER":
      return "volunteer";
    case "SCOUT":
      return "scout";
    case "ADMIN":
      return "admin";
    default:
      return "athlete";
  }
}

export function profileToUser(row: Partial<ProfileRow> | null | undefined): User | null {
  if (!row) return null;

  return {
    id: row.id ?? row.auth_user_id ?? "",
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    role: normalizeRole(row.role),
    cityId: row.city_id ?? "",
    profileImage: row.profile_photo_url ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
    isActive: row.is_active ?? true,
  };
}

export async function getProfileByAuthId(authUserId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await authSupabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    console.warn("Could not load profile from Supabase:", error.message);
    return null;
  }

  return profileToUser(data);
}

export async function createProfileRecord(input: {
  authUserId: string;
  name: string;
  email: string;
  role: Role;
  cityId?: string;
  area?: string;
  profilePhotoUrl?: string;
}): Promise<User> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const payload = {
    id: input.authUserId,
    auth_user_id: input.authUserId,
    name: input.name,
    email: input.email,
    phone: "",
    role: normalizeRoleForDatabase(input.role),
    city_id: input.cityId ?? "",
    area: input.area ?? "",
    profile_photo_url: input.profilePhotoUrl ?? "",
    profile_visibility: "public",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await authSupabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const user = profileToUser(data);
  if (!user) {
    throw new Error("Supabase profile creation did not return a profile");
  }

  return user;
}

/**
 * Saves the account fields shared by every role. Role-specific fields are
 * deliberately written to their own table so a user cannot change their role
 * or another account through this client helper.
 */
export async function updateProfileRecord(
  authUserId: string,
  input: {
    name?: string;
    phone?: string;
    cityId?: string;
    area?: string;
    profilePhotoUrl?: string;
    profileVisibility?: "private" | "public" | "network";
  },
): Promise<User> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const payload = {
    ...(input.name === undefined ? {} : { name: input.name }),
    ...(input.phone === undefined ? {} : { phone: input.phone }),
    ...(input.cityId === undefined ? {} : { city_id: input.cityId }),
    ...(input.area === undefined ? {} : { area: input.area }),
    ...(input.profilePhotoUrl === undefined ? {} : { profile_photo_url: input.profilePhotoUrl }),
    ...(input.profileVisibility === undefined
      ? {}
      : { profile_visibility: input.profileVisibility }),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await authSupabase
    .from("profiles")
    .update(payload)
    .eq("auth_user_id", authUserId)
    .select()
    .single();
  if (error) throw new Error(error.message);

  const user = profileToUser(data);
  if (!user) throw new Error("Supabase profile update did not return a profile");
  return user;
}

export async function updateRoleSpecificProfile(
  role: Role,
  authUserId: string,
  details: Record<string, unknown>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const updatedAt = new Date().toISOString();
  const city = readString(details, "city");
  const area = readString(details, "area");
  const profilePhotoUrl = readString(details, "profile_photo_url");
  let error: { message: string } | null = null;

  if (role === "ATHLETE") {
    ({ error } = await authSupabase
      .from("athlete_profiles")
      .update({
        city,
        area,
        institution: readString(details, "institution"),
        primary_sport: readString(details, "primary_sport"),
        secondary_sports: readStringArray(details, "secondary_sports"),
        position: readString(details, "position"),
        bio: readString(details, "bio"),
        profile_visibility: readProfileVisibility(details),
        profile_photo_url: profilePhotoUrl,
        updated_at: updatedAt,
      })
      .eq("auth_user_id", authUserId));
  } else if (role === "ORGANIZER") {
    ({ error } = await authSupabase
      .from("organizer_profiles")
      .update({
        city,
        area,
        phone: readString(details, "phone"),
        email: readString(details, "email"),
        description: readString(details, "description"),
        organization_name: readString(details, "organization_name"),
        organizer_type: readString(details, "organizer_type"),
        profile_photo_url: profilePhotoUrl,
        updated_at: updatedAt,
      })
      .eq("auth_user_id", authUserId));
  } else if (role === "COLLEGE") {
    ({ error } = await authSupabase
      .from("institution_profiles")
      .update({
        city,
        area,
        phone: readString(details, "phone"),
        email: readString(details, "email"),
        description: readString(details, "description"),
        institution_name: readString(details, "institution_name"),
        institution_type: readString(details, "institution_type", "College"),
        profile_photo_url: profilePhotoUrl,
        updated_at: updatedAt,
      })
      .eq("auth_user_id", authUserId));
  } else if (role === "VOLUNTEER") {
    ({ error } = await authSupabase
      .from("volunteer_profiles")
      .update({
        city,
        area,
        profile_photo_url: profilePhotoUrl,
        updated_at: updatedAt,
      })
      .eq("auth_user_id", authUserId));
  } else {
    return;
  }

  if (error) throw new Error(error.message);
}

/** Admin-only account inventory. RLS is the authorization boundary here. */
export async function listManagedProfiles(): Promise<ManagedProfile[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await authSupabase
    .from("profiles")
    .select("id, email, name, role, is_active, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function setManagedProfileActive(profileId: string, isActive: boolean): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const { error } = await authSupabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", profileId);
  if (error) throw new Error(error.message);
}

export async function createRoleSpecificProfile(
  role: Role,
  authUserId: string,
  details: Record<string, unknown> = {},
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const basePayload = { id: authUserId, profile_id: authUserId, auth_user_id: authUserId };
  const updatedAt = new Date().toISOString();
  let error: { message: string } | null = null;

  if (role === "ATHLETE") {
    ({ error } = await authSupabase.from("athlete_profiles").upsert(
      {
        ...basePayload,
        city: readString(details, "city"),
        area: readString(details, "area"),
        institution: readString(details, "institution"),
        primary_sport: readString(details, "primary_sport", "football"),
        secondary_sports: readStringArray(details, "secondary_sports"),
        position: readString(details, "position"),
        position_group: readString(details, "position_group", "FORWARD"),
        age_group: readString(details, "age_group", "OPEN"),
        bio: readString(details, "bio"),
        date_of_birth: readString(details, "date_of_birth") || null,
        gender: readGender(details),
        contact_visibility: readString(details, "contact_visibility", "private"),
        profile_visibility: readProfileVisibility(details),
        verification_status: readVerificationState(details),
        profile_photo_url: readString(details, "profile_photo_url"),
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    ));
  } else if (role === "ORGANIZER") {
    ({ error } = await authSupabase.from("organizer_profiles").upsert(
      {
        ...basePayload,
        organization_name: readString(details, "organization_name"),
        organizer_type: readString(details, "organizer_type", "Club"),
        city: readString(details, "city"),
        area: readString(details, "area"),
        phone: readString(details, "phone"),
        email: readString(details, "email"),
        description: readString(details, "description"),
        verification_status: readVerificationState(details),
        profile_photo_url: readString(details, "profile_photo_url"),
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    ));
  } else if (role === "COLLEGE") {
    ({ error } = await authSupabase.from("institution_profiles").upsert(
      {
        ...basePayload,
        institution_name: readString(details, "institution_name"),
        institution_type: readString(details, "institution_type", "College"),
        city: readString(details, "city"),
        area: readString(details, "area"),
        address: readString(details, "address"),
        phone: readString(details, "phone"),
        email: readString(details, "email"),
        description: readString(details, "description"),
        verification_status: readVerificationState(details),
        profile_photo_url: readString(details, "profile_photo_url"),
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    ));
  } else if (role === "VOLUNTEER") {
    ({ error } = await authSupabase.from("volunteer_profiles").upsert(
      {
        ...basePayload,
        city: readString(details, "city"),
        area: readString(details, "area"),
        role: readString(details, "role", "field-volunteer"),
        active: details["active"] !== false,
        profile_photo_url: readString(details, "profile_photo_url"),
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    ));
  } else {
    return;
  }

  if (error) {
    throw new Error(error.message);
  }
}

export async function signOutSupabaseSession() {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}
