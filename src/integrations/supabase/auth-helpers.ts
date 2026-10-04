import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
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

  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    console.warn("Could not load profile from Supabase:", error.message);
    return null;
  }

  return profileToUser(data as Partial<ProfileRow>);
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

  const { data, error } = await (supabase as any)
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const user = profileToUser(data as Partial<ProfileRow>);
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

  const { data, error } = await (supabase as any)
    .from("profiles")
    .update(payload)
    .eq("auth_user_id", authUserId)
    .select()
    .single();
  if (error) throw new Error(error.message);

  const user = profileToUser(data as Partial<ProfileRow>);
  if (!user) throw new Error("Supabase profile update did not return a profile");
  return user;
}

export async function updateRoleSpecificProfile(
  role: Role,
  authUserId: string,
  details: Record<string, unknown>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const tableMap: Partial<Record<Role, string>> = {
    ATHLETE: "athlete_profiles",
    ORGANIZER: "organizer_profiles",
    COLLEGE: "institution_profiles",
    VOLUNTEER: "volunteer_profiles",
  };
  const table = tableMap[role];
  if (!table) return;

  const allowed =
    role === "ATHLETE"
      ? [
          "city",
          "area",
          "institution",
          "primary_sport",
          "secondary_sports",
          "position",
          "bio",
          "profile_visibility",
          "profile_photo_url",
        ]
      : role === "ORGANIZER"
        ? [
            "city",
            "area",
            "phone",
            "email",
            "description",
            "organization_name",
            "organizer_type",
            "profile_photo_url",
          ]
        : role === "COLLEGE"
          ? [
              "city",
              "area",
              "phone",
              "email",
              "description",
              "institution_name",
              "institution_type",
              "profile_photo_url",
            ]
          : ["city", "area", "role", "profile_photo_url"];
  const payload = Object.fromEntries(
    Object.entries(details).filter(([key]) => allowed.includes(key)),
  );
  if (!Object.keys(payload).length) return;

  const { error } = await (supabase as any)
    .from(table)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("auth_user_id", authUserId);
  if (error) throw new Error(error.message);
}

/** Admin-only account inventory. RLS is the authorization boundary here. */
export async function listManagedProfiles(): Promise<ManagedProfile[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("id, email, name, role, is_active, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as ManagedProfile[];
}

export async function setManagedProfileActive(profileId: string, isActive: boolean): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const { error } = await (supabase as any)
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

  const tableMap: Record<Role, string> = {
    ATHLETE: "athlete_profiles",
    ORGANIZER: "organizer_profiles",
    COLLEGE: "institution_profiles",
    VOLUNTEER: "volunteer_profiles",
    ADMIN: "profiles",
    SCOUT: "profiles",
  };

  const table = tableMap[role];
  if (!table || table === "profiles") return;

  const basePayload = {
    id: authUserId,
    profile_id: authUserId,
    auth_user_id: authUserId,
    updated_at: new Date().toISOString(),
  };

  const payloadByRole: Record<Role, Record<string, unknown>> = {
    ATHLETE: {
      city: details["city"] ?? "",
      area: details["area"] ?? "",
      institution: details["institution"] ?? "",
      primary_sport: details["primary_sport"] ?? "football",
      secondary_sports: details["secondary_sports"] ?? [],
      position: details["position"] ?? "",
      position_group: details["position_group"] ?? "FORWARD",
      age_group: details["age_group"] ?? "OPEN",
      bio: details["bio"] ?? "",
      date_of_birth: details["date_of_birth"] ?? null,
      gender: details["gender"] ?? "male",
      contact_visibility: details["contact_visibility"] ?? "private",
      profile_visibility: details["profile_visibility"] ?? "private",
      verification_status: details["verification_status"] ?? "pending",
      profile_photo_url: details["profile_photo_url"] ?? "",
      latitude: details["latitude"] ?? null,
      longitude: details["longitude"] ?? null,
      geo_point: details["geo_point"] ?? null,
    },
    ORGANIZER: {
      organization_name: details["organization_name"] ?? "",
      organizer_type: details["organizer_type"] ?? "Club",
      city: details["city"] ?? "",
      area: details["area"] ?? "",
      phone: details["phone"] ?? "",
      email: details["email"] ?? "",
      description: details["description"] ?? "",
      verification_status: details["verification_status"] ?? "pending",
      profile_photo_url: details["profile_photo_url"] ?? "",
      latitude: details["latitude"] ?? null,
      longitude: details["longitude"] ?? null,
      geo_point: details["geo_point"] ?? null,
    },
    COLLEGE: {
      institution_name: details["institution_name"] ?? "",
      institution_type: details["institution_type"] ?? "College",
      city: details["city"] ?? "",
      area: details["area"] ?? "",
      address: details["address"] ?? "",
      phone: details["phone"] ?? "",
      email: details["email"] ?? "",
      description: details["description"] ?? "",
      verification_status: details["verification_status"] ?? "pending",
      profile_photo_url: details["profile_photo_url"] ?? "",
      latitude: details["latitude"] ?? null,
      longitude: details["longitude"] ?? null,
      geo_point: details["geo_point"] ?? null,
    },
    VOLUNTEER: {
      city: details["city"] ?? "",
      area: details["area"] ?? "",
      role: details["role"] ?? "field-volunteer",
      active: details["active"] ?? true,
      profile_photo_url: details["profile_photo_url"] ?? "",
      latitude: details["latitude"] ?? null,
      longitude: details["longitude"] ?? null,
      geo_point: details["geo_point"] ?? null,
    },
    ADMIN: {
      city: details["city"] ?? "",
      area: details["area"] ?? "",
    },
    SCOUT: {
      city: details["city"] ?? "",
      area: details["area"] ?? "",
    },
  };

  const payload = { ...basePayload, ...payloadByRole[role] };

  const { error } = await (supabase as any).from(table).upsert(payload, { onConflict: "id" });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signOutSupabaseSession() {
  if (!isSupabaseConfigured()) return;
  await supabase.auth.signOut();
}
