# KheloLocal

You are the lead product engineer, UI/UX designer, Firebase architect, and rapid-prototyping engineer for KheloLocal.

IMPORTANT:
Do not build a generic sports app.
Do not improvise the product concept.
Do not add random features.
Build the exact MVP architecture, user journeys, visual language, data model, and demo flow described below.

==================================================
1. PRODUCT
==================================================

PRODUCT NAME:
KheloLocal

TAGLINE:
Your city's sports network.

POSITIONING:
KheloLocal is a city-first, multi-sport sports network connecting grassroots athletes, tournaments, organizers, coaches, scouts, and teams.

INITIAL CITY:
Indore, Madhya Pradesh, India.

MVP SPORTS:
1. Football
2. Kabaddi

FUTURE:
The architecture must allow additional cities and sports without requiring a rewrite.

CORE PRODUCT THESIS:

Local sports activity already exists, but the information and people involved are fragmented across WhatsApp, Instagram, personal networks, academies, clubs, and disconnected event platforms.

KheloLocal creates a connected local sports layer.

The most important product mechanism is:

TOURNAMENT
→ PARTICIPATION
→ MATCH
→ RESULT
→ ORGANIZER VERIFICATION
→ ATHLETE RECORD
→ VERIFIED SPORTS IDENTITY
→ TALENT DISCOVERY
→ NEXT OPPORTUNITY

The athlete profile is NOT the core product.

The tournament-to-athlete-data loop is the core product.

==================================================
2. PRIMARY PROBLEM
==================================================

Grassroots athletes often struggle to build credible, discoverable sporting identities.

Tournament organizers struggle to reach relevant local athletes and teams beyond their existing networks.

Teams, coaches and scouts struggle to discover suitable local talent through structured information.

Local tournament information is fragmented and often remains limited to personal networks, WhatsApp groups, Instagram posts, and word-of-mouth.

KheloLocal solves this by creating a city-level network where sporting activity generates structured and, where possible, organizer-verified athlete records.

==================================================
3. MVP OBJECTIVE
==================================================

Build a WORKING, DEMO-READY MVP.

This is a hackathon prototype, not a production-grade national sports platform.

The MVP must prove one complete journey:

ORGANIZER
→ creates/manages tournament
→ manages participants
→ manages fixtures
→ records match result
→ verifies result

THEN:

ATHLETE
→ athlete profile automatically reflects verified result/achievement

THEN:

SCOUT/COACH/TEAM
→ searches local talent
→ filters athletes
→ discovers the athlete
→ opens verified athlete profile

This complete loop is the most important thing in the application.

==================================================
4. USER ROLES
==================================================

Implement exactly 3 primary roles for MVP:

A. ATHLETE
B. ORGANIZER
C. SCOUT / COACH / TEAM

Do NOT create separate roles for Scout, Coach and Team in the MVP.

They share the same discovery experience.

--------------------------------------------------
ATHLETE CAPABILITIES
--------------------------------------------------

Athlete can:

- create account
- create sports profile
- select city
- select sport
- add position
- add skills
- discover tournaments
- filter tournaments
- view tournament details
- register for tournaments
- view registered tournaments
- view matches
- view results
- view verified achievements
- view personal statistics
- have their profile discovered by scouts/coaches/teams

--------------------------------------------------
ORGANIZER CAPABILITIES
--------------------------------------------------

Organizer can:

- create account
- create organizer profile
- create tournament
- select sport
- select city
- specify venue
- specify dates
- specify age category
- specify gender category
- specify registration fee
- specify prize pool
- set participant limit
- view participants
- approve/reject registrations
- generate/manage fixtures
- open a match
- enter score
- enter player performance
- complete match
- verify result
- publish result

--------------------------------------------------
SCOUT / COACH / TEAM CAPABILITIES
--------------------------------------------------

Can:

- browse athletes
- filter athletes
- search by sport
- search by city
- filter by age category
- filter by position
- filter by verified experience
- open athlete profile
- view verified achievements
- request connection

For MVP, "Request Connection" can be a functional UI interaction without building a full messaging system.

==================================================
5. NON-GOALS
==================================================

DO NOT build these into the MVP:

- player auction system
- payments
- chat
- social feed
- livestreaming
- video analysis
- AI match prediction
- AI player ranking
- advanced recommendation engine
- academy management
- complex league administration
- GPS tracking
- real-time location tracking
- national federation integration
- complex certificate generation
- advanced analytics
- cryptocurrency
- unnecessary gamification

These are future roadmap features.

Do not let these distract from the core loop.

==================================================
6. TECHNOLOGY
==================================================

Use the technology available within the Antigravity/Firebase environment.

Preferred architecture:

FRONTEND:
- React / Next.js if supported
- TypeScript
- Tailwind CSS

BACKEND:
- Firebase

AUTHENTICATION:
- Firebase Authentication

DATABASE:
- Cloud Firestore

FILE STORAGE:
- Firebase Storage

SERVER-SIDE LOGIC:
- Firebase Cloud Functions if required

Do NOT introduce unnecessary external services.

If Firebase configuration is not available yet, create a clean mock/data layer that can later be connected to Firebase without changing the UI architecture.

However, the prototype should be structured for Firebase from the beginning.

==================================================
7. ARCHITECTURE
==================================================

Use this conceptual architecture:

                    KHELOLOCAL
                         |
                Web Application
                         |
               Authentication
                         |
                    Firestore
                         |
       ----------------------------------
       |       |       |       |        |
    Users   Athletes  Tournaments Matches
                         |
                    Results
                         |
                    Verification
                         |
                 Achievements
                         |
                 Athlete Identity
                         |
                Talent Discovery

The system must use reusable components and data-driven rendering.

Do not hard-code every screen independently.

==================================================
8. FIRESTORE DATA MODEL
==================================================

Create the following collections.

--------------------------------------------------
users
--------------------------------------------------

users/{userId}

Fields:

id
name
email
phone
role
cityId
profileImage
createdAt
updatedAt
isActive

role values:

ATHLETE
ORGANIZER
SCOUT

--------------------------------------------------
athletes
--------------------------------------------------

athletes/{athleteId}

Fields:

userId
name
profileImage
cityId
cityName
dateOfBirth
gender
primarySport
secondarySports
position
skills
bio
verificationStatus
tournamentsPlayed
matchesPlayed
wins
losses
verifiedAchievementsCount
createdAt
updatedAt

--------------------------------------------------
organizers
--------------------------------------------------

organizers/{organizerId}

Fields:

userId
organizationName
organizationType
cityId
cityName
description
logo
phone
email
verificationStatus
tournamentsHosted
createdAt
updatedAt

--------------------------------------------------
sports
--------------------------------------------------

sports/{sportId}

Fields:

name
icon
active

Initial records:

football
kabaddi

The architecture must support adding more sports later.

--------------------------------------------------
cities
--------------------------------------------------

cities/{cityId}

Fields:

name
state
country
latitude
longitude
active

Initial city:

Indore
Madhya Pradesh
India

The architecture must support additional cities later.

--------------------------------------------------
tournaments
--------------------------------------------------

tournaments/{tournamentId}

Fields:

name
sportId
sportName
organizerId
organizerName
cityId
cityName
venue
address
startDate
endDate
registrationDeadline
ageCategory
genderCategory
format
maxParticipants
currentParticipants
registrationFee
prizePool
description
status
bannerImage
createdAt
updatedAt

status values:

DRAFT
UPCOMING
REGISTRATION_OPEN
LIVE
COMPLETED
CANCELLED

--------------------------------------------------
registrations
--------------------------------------------------

registrations/{registrationId}

Fields:

tournamentId
athleteId
teamId
registrationDate
status
paymentStatus
seedNumber

status:

PENDING
APPROVED
REJECTED
WITHDRAWN

For MVP, paymentStatus can simply be:

NOT_REQUIRED

Do not implement actual payment.

--------------------------------------------------
teams
--------------------------------------------------

teams/{teamId}

Fields:

name
sportId
sportName
cityId
cityName
logo
captainId
coachId
players
createdAt

players is an array of athlete IDs.

--------------------------------------------------
matches
--------------------------------------------------

matches/{matchId}

Fields:

tournamentId
round
matchNumber
teamAId
teamBId
teamAScore
teamBScore
scheduledAt
venue
status
winnerId
resultStatus
createdAt
updatedAt

status:

SCHEDULED
LIVE
COMPLETED

resultStatus:

PENDING
VERIFIED
REJECTED

--------------------------------------------------
playerPerformances
--------------------------------------------------

playerPerformances/{performanceId}

Fields:

matchId
tournamentId
athleteId
teamId
goals
assists
points
playerOfMatch
performanceNotes
createdAt

For future sports, allow sport-specific optional fields.

For example:

raidPoints
tacklePoints
bonusPoints

Do not create separate databases for every sport.

--------------------------------------------------
verifications
--------------------------------------------------

verifications/{verificationId}

Fields:

matchId
tournamentId
organizerId
status
verifiedAt
verificationNote

status:

PENDING
VERIFIED
REJECTED

--------------------------------------------------
achievements
--------------------------------------------------

achievements/{achievementId}

Fields:

athleteId
tournamentId
matchId
title
description
achievementType
verified
verifiedBy
date
createdAt

achievementType examples:

TOURNAMENT_WIN
RUNNER_UP
PLAYER_OF_MATCH
TOP_SCORER
MATCH_PERFORMANCE

==================================================
9. CRITICAL DATA RELATIONSHIP
==================================================

The following relationship must work:

Tournament
→ Registration
→ Athlete

Tournament
→ Match
→ Result
→ Player Performance
→ Achievement
→ Athlete Profile

Do NOT manually duplicate athlete statistics wherever possible.

When a verified match result is published, update the relevant athlete statistics.

Example:

Before verification:

Aarav Sharma:
matchesPlayed = 22
wins = 15
goals = 12
verifiedAchievementsCount = 4

Match result:

Indore Strikers 3
Vijay Nagar FC 1

Aarav:
2 goals
Player of Match

After verification:

matchesPlayed = 23
wins = 16
goals = 14
verifiedAchievementsCount = 5

Add achievement:

"Player of the Match — Indore City Football Cup"

verified = true

This automatic update is one of the most important demo interactions.

==================================================
10. DESIGN DIRECTION
==================================================

The application must feel like a serious modern sports product.

Avoid:

- childish sports graphics
- excessive gradients
- generic AI dashboard aesthetics
- excessive glassmorphism
- overly rounded UI
- stock-photo-heavy design
- cluttered interfaces
- unnecessary animations

Visual direction:

- modern
- energetic
- local
- trustworthy
- sports-focused
- premium but accessible
- mobile-friendly
- clean information hierarchy

Use a strong sports-oriented visual system.

Suggested palette:

Primary:
Deep navy / near-black

Accent:
Energetic green or electric lime

Supporting:
White
Cool gray
Muted slate

IMPORTANT:
Do not make the UI look like a banking dashboard.

It should feel like a modern sports network.

Typography:

Use a clean modern sans-serif.

Large bold headings.

Strong numeric typography for sports statistics.

Use clear badges for:

Verified
Live
Upcoming
Completed

==================================================
11. GLOBAL NAVIGATION
==================================================

Desktop:

Logo:
KheloLocal

Navigation changes based on role.

ATHLETE:

Home
Tournaments
My Sports
Profile

ORGANIZER:

Dashboard
My Tournaments
Create Tournament
Results
Profile

SCOUT:

Discover
Saved Athletes
Connections
Profile

Mobile:

Use bottom navigation where appropriate.

==================================================
12. SCREEN INVENTORY
==================================================

Build these screens.

--------------------------------------------------
PUBLIC
--------------------------------------------------

01. LANDING PAGE

Hero:

"Your city's sports network."

Subheading:

"Discover athletes. Find tournaments. Build your sporting identity."

Primary CTA:

Find Tournaments

Secondary CTA:

Host a Tournament

Additional CTA:

Discover Athletes

Show a concise explanation of the KheloLocal ecosystem.

Show:

Athletes
Tournaments
Organizers
Teams

connected visually.

Show an "How it works" section:

Participate
→ Record
→ Verify
→ Discover

--------------------------------------------------
02. EXPLORE TOURNAMENTS
--------------------------------------------------

Page title:

"Sports Near You"

Location:

Indore

Filters:

Sport
Date
Age Category
Gender
Tournament Status

Tournament cards should include:

Name
Sport
Location
Date
Organizer
Participants
Prize Pool
Status

--------------------------------------------------
03. TOURNAMENT DETAILS
--------------------------------------------------

Show:

Tournament name
Sport
Organizer
Verified organizer badge if applicable
Location
Venue
Date
Registration deadline
Age category
Participants
Prize pool
Description

Tabs:

Overview
Teams
Fixtures
Results

Primary CTA:

Register Now

--------------------------------------------------
AUTHENTICATION
--------------------------------------------------

04. LOGIN

Email
Password

Forgot password

Login

Link to sign up

--------------------------------------------------
05. SIGN UP
--------------------------------------------------

Step 1:

"How will you use KheloLocal?"

Cards:

Athlete
Organizer
Scout / Coach / Team

Then create relevant profile.

Keep onboarding short.

Do not create a 15-field registration form.

--------------------------------------------------
ATHLETE
--------------------------------------------------

06. ATHLETE DASHBOARD

Example:

"Good evening, Aarav 👋"

"Indore"

Hero statistic card:

Verified Sports Identity

Stats:

8 Tournaments
23 Matches
16 Wins
5 Verified Achievements

Upcoming tournaments

Recommended local opportunities

Recent achievements

--------------------------------------------------
07. ATHLETE PROFILE
--------------------------------------------------

This is a HERO SCREEN.

Display:

Profile photo
Name
City
Sport
Position
Verification status

Large stats:

Tournaments
Matches
Wins
Verified Achievements

Skills:

Finishing
Passing
Pace
Pressing

Bio

Verified Achievements timeline

Each achievement:

Tournament
Achievement
Date
Verified by

Use a clear:

✓ Verified

badge.

The profile should visually communicate credibility.

--------------------------------------------------
08. MY TOURNAMENTS
--------------------------------------------------

Tabs:

Upcoming
Active
Completed

Cards show:

Tournament
Sport
Date
Status

--------------------------------------------------
ORGANIZER
--------------------------------------------------

09. ORGANIZER DASHBOARD
--------------------------------------------------

Show:

Organization name

Stats:

Active Tournaments
Registered Athletes
Matches
Pending Verification

My tournaments list.

Quick actions:

Create Tournament
Manage Participants
Manage Matches

--------------------------------------------------
10. CREATE TOURNAMENT
--------------------------------------------------

Fields:

Tournament Name
Sport
City
Venue
Address
Start Date
End Date
Registration Deadline
Age Category
Gender Category
Format
Maximum Participants
Registration Fee
Prize Pool
Description
Banner

CTA:

Create Tournament

On success:

Tournament created.

Option:

Open Tournament Dashboard

--------------------------------------------------
11. MANAGE TOURNAMENT
--------------------------------------------------

Tabs:

Overview
Participants
Fixtures
Matches
Results

Overview:

Tournament information
Registration progress

Participants:

Athlete list
Registration status

Fixtures:

Fixture cards

Matches:

Match status

Results:

Published results

--------------------------------------------------
12. FIXTURE MANAGEMENT
--------------------------------------------------

Show bracket/list.

Example:

QUARTER FINAL

Indore Strikers
VS
Vijay Nagar FC

29 Aug
5:00 PM

Actions:

Open Match
Edit
Reschedule

Provide a simple:

Generate Fixtures

button.

It can use simple deterministic fixture generation for MVP.

Do NOT implement a mathematically complex tournament engine.

--------------------------------------------------
13. LIVE MATCH SCORING
--------------------------------------------------

This is another HERO SCREEN.

Show:

Tournament
Round
Match

Team A
Score

Team B
Score

Player performance section.

For football:

Goals
Assists
Player of Match

Example:

Aarav Sharma
Goals: 2
Player of Match: yes

Actions:

Add Goal
Add Assist
Mark Player of Match
Finish Match

On Finish:

Result status = PENDING

Then direct user to verification.

--------------------------------------------------
14. RESULT VERIFICATION
--------------------------------------------------

Show:

Match

Teams
Final score

Player performances

Achievements to be generated

Example:

Aarav Sharma
2 goals
Player of Match

Button:

VERIFY & PUBLISH

Confirmation modal:

"Verify and publish this result?"

After confirmation:

Success state:

✓ Result verified
✓ Athlete records updated
✓ Achievement added
✓ Result published

This is a critical interaction.

--------------------------------------------------
DISCOVERY
--------------------------------------------------

15. TALENT DISCOVERY
--------------------------------------------------

Page title:

"Find Local Talent"

Filters:

Sport
City
Age Category
Position
Verified Experience

Search input:

Search athlete...

Athlete cards show:

Photo
Name
Sport
Position
City

Stats:

Tournaments
Wins
Achievements

Verified badge.

--------------------------------------------------
16. ATHLETE PUBLIC PROFILE
--------------------------------------------------

Show same athlete profile.

But from Scout perspective.

CTA:

Request Connection

Save Athlete

Do not build full messaging.

--------------------------------------------------
OPTIONAL
--------------------------------------------------

17. NOTIFICATIONS

Only implement if time allows.

Examples:

Tournament registration approved
Match result verified
New tournament in Indore
Connection request received

==================================================
13. RESPONSIVE DESIGN
==================================================

The prototype must work on:

Desktop
Tablet
Mobile

Prioritize desktop for the hackathon demo but ensure mobile layouts do not break.

Use responsive navigation.

Cards should stack appropriately.

Tables should become scrollable or cards on mobile.

==================================================
14. SEED DATA
==================================================

DO NOT launch with an empty database.

Seed realistic demo data.

CITY:

Indore, Madhya Pradesh

SPORTS:

Football
Kabaddi

--------------------------------------------------
ATHLETES
--------------------------------------------------

Create at least 12 realistic fictional athletes.

Use diverse names.

Important hero athlete:

Aarav Sharma

Sport:
Football

City:
Indore

Position:
ST / RW

Skills:
Finishing
Passing
Pace
Pressing

Stats:

8 tournaments
23 matches
16 wins
14 goals
5 verified achievements

--------------------------------------------------
TOURNAMENTS
--------------------------------------------------

Create at least:

1. Indore City Football Cup
2. Indore U-19 Football League
3. Malwa Kabaddi Championship
4. Vijay Nagar Open Kabaddi Cup
5. Indore Monsoon Football League

Statuses should vary:

Upcoming
Registration Open
Live
Completed

--------------------------------------------------
TEAMS
--------------------------------------------------

Create:

Indore Strikers
Vijay Nagar FC
Rau United
Malwa Warriors
Indore Titans
City Kickers
Vijay Nagar Warriors
Malwa Sports Club

--------------------------------------------------
ORGANIZER
--------------------------------------------------

Create:

Indore Football Association

City:
Indore

Status:
Verified

It should own the hero tournament:

Indore City Football Cup

--------------------------------------------------
HERO TOURNAMENT
--------------------------------------------------

Name:

Indore City Football Cup

Sport:

Football

Location:

Rau, Indore

Category:

U-19

Prize Pool:

₹25,000

Participants:

64 / 80

Status:

LIVE

--------------------------------------------------
HERO MATCH
--------------------------------------------------

Tournament:

Indore City Football Cup

Teams:

Indore Strikers
Vijay Nagar FC

Pre-demo state:

Match exists.

During demo, organizer can enter:

3 - 1

Aarav Sharma:

2 goals

Player of Match:

Yes

Then verify.

==================================================
15. DEMO FLOW
==================================================

THIS IS THE MOST IMPORTANT PART OF THE BUILD.

The entire prototype must support this demo.

STEP 1:

Login as Organizer.

STEP 2:

Open:

Indore City Football Cup

STEP 3:

Open live match:

Indore Strikers
VS
Vijay Nagar FC

STEP 4:

Enter:

3 - 1

Aarav Sharma:
2 goals

Player of Match:
Yes

STEP 5:

Finish match.

STEP 6:

Result becomes:

PENDING VERIFICATION

STEP 7:

Open Result Verification.

STEP 8:

Click:

VERIFY & PUBLISH

STEP 9:

System updates Aarav:

Matches:
22 → 23

Wins:
15 → 16

Goals:
12 → 14

Verified achievements:
4 → 5

STEP 10:

Create achievement:

Player of the Match
Indore City Football Cup

Verified by:

Indore Football Association

STEP 11:

Switch to Scout / Coach / Team.

STEP 12:

Open Talent Discovery.

Filter:

Sport:
Football

City:
Indore

Age:
U-19

Position:
Forward

Verified Experience:
2+ tournaments

STEP 13:

Aarav Sharma appears.

STEP 14:

Open profile.

Show:

✓ Verified Sports Identity

5 Verified Achievements

Latest achievement:

Player of the Match
Indore City Football Cup

This entire flow MUST work.

==================================================
16. DATA UPDATE LOGIC
==================================================

When organizer verifies a match:

1. Match resultStatus changes to VERIFIED.
2. Match status changes to COMPLETED.
3. Player performance becomes verified.
4. Athlete match count updates.
5. Athlete win/loss updates.
6. Athlete relevant statistics update.
7. Achievement record is created.
8. verifiedAchievementsCount updates.
9. Athlete profile immediately reflects the change.
10. Talent discovery uses the updated values.

Do not fake this with a visual-only animation.

The underlying prototype data should actually change.

==================================================
17. VERIFICATION LOGIC
==================================================

For MVP:

Only the organizer associated with the tournament can verify the result.

Do not implement complex multi-party verification yet.

When organizer clicks:

VERIFY & PUBLISH

show confirmation.

After confirmation:

- create verification record
- update match
- update player performance
- update athlete
- create achievement
- publish result

==================================================
18. SEARCH AND FILTER LOGIC
==================================================

Talent Discovery must support:

sport
city
age category
position
verified achievements

Tournament discovery must support:

sport
city
date
age category
status

Use Firestore queries where practical.

If Firestore compound indexing becomes a blocker during prototype generation, implement filtering on the client against the loaded dataset.

Do not allow technical complexity to break the demo.

==================================================
19. AUTHENTICATION / DEMO ACCOUNTS
==================================================

Create demo login access.

Suggested:

ATHLETE:
athlete@khelolocal.demo

ORGANIZER:
organizer@khelolocal.demo

SCOUT:
scout@khelolocal.demo

If real Firebase authentication setup is not available during initial generation, implement a clearly isolated demo authentication layer that can later be replaced with Firebase Auth.

Do not expose passwords in the UI.

==================================================
20. SECURITY / TRUST
==================================================

Even though this is a prototype, structure permissions by role.

Athlete:

Can edit own profile.

Organizer:

Can manage own tournaments.

Organizer:

Can verify results only for their own tournaments.

Scout:

Can view public athlete profiles.

Do not allow arbitrary users to modify verified achievements.

Verified achievement records should be treated as controlled data.

==================================================
21. MINOR ATHLETE CONSIDERATION
==================================================

The broader product may include athletes under 18.

For the MVP:

Include an age category field.

Do not implement complex legal/consent infrastructure unless required.

However, avoid exposing sensitive personal information publicly.

Public athlete profile should prioritize:

name
sport
city
position
skills
sport statistics
verified achievements

Do NOT publicly expose:

phone number
email
exact home address
date of birth

==================================================
22. UI STATES
==================================================

Every important screen should have:

Loading state
Empty state
Error state
Success state

Examples:

No tournaments:

"No tournaments found in Indore."

No athletes:

"No athletes match these filters."

Successful verification:

"Result verified and athlete record updated."

Registration success:

"You're registered for this tournament."

==================================================
23. MICROCOPY
==================================================

Use simple, human language.

Avoid corporate jargon.

Examples:

Instead of:

"Initialize Athlete Discovery Protocol"

Use:

"Find Local Talent"

Instead of:

"Create Competitive Sporting Entity"

Use:

"Create Tournament"

Instead of:

"Validate Performance Data"

Use:

"Verify Result"

Instead of:

"Network Participants"

Use:

"Connect"

==================================================
24. LANDING PAGE MESSAGE
==================================================

Hero:

YOUR CITY'S SPORTS NETWORK.

Subheading:

Discover athletes. Find tournaments. Build your sporting identity.

Supporting statement:

"KheloLocal connects the athletes, tournaments, organizers and teams that make grassroots sports happen."

CTA:

Explore Tournaments

Secondary:

Host a Tournament

Third:

Discover Talent

--------------------------------------------------

SECTION:

HOW IT WORKS

01
Participate

Find and join local tournaments.

02
Record

Matches generate structured sporting data.

03
Verify

Organizers confirm results and achievements.

04
Discover

Verified sporting identities become discoverable.

--------------------------------------------------

SECTION:

BUILT FOR

Athletes
Organizers
Teams & Coaches

--------------------------------------------------

SECTION:

STARTING IN INDORE

"Built locally. Designed to scale city by city."

==================================================
25. ATHLETE PROFILE DESIGN
==================================================

This should be one of the strongest screens visually.

Header:

[Profile Photo]

Aarav Sharma

Football • Indore

ST / RW

✓ Verified Sports Identity

Stats row:

8
Tournaments

23
Matches

16
Wins

5
Verified

Skills:

Finishing
Passing
Pace
Pressing

Recent Achievements:

🏆 Indore U-19 Football League
Tournament Winner
✓ Verified

⭐ Indore City Football Cup
Player of the Match
✓ Verified

Use timeline/card layout.

==================================================
26. TOURNAMENT CARD DESIGN
==================================================

Example:

INDORE CITY FOOTBALL CUP

Football
📍 Rau, Indore

29 AUG 2026

U-19

64 / 80 Participants

₹25,000 Prize Pool

● Registration Open

[View Tournament]

Do not overuse emoji in the actual application.
Use icons where the icon library supports them.

==================================================
27. ORGANIZER DASHBOARD DESIGN
==================================================

Header:

Indore Football Association

Verified Organizer

Stats:

3
Active Tournaments

184
Registered Athletes

42
Matches

2
Pending Verification

Main section:

My Tournaments

Each tournament should have:

Status
Participants
Matches
Action

==================================================
28. TALENT DISCOVERY DESIGN
==================================================

Title:

Find Local Talent

Subtitle:

"Discover athletes by sport, location and verified experience."

Filter bar.

Athlete result cards.

Each card should make verification highly visible.

Example:

Aarav Sharma

Football
ST / RW
Indore

23 Matches
16 Wins
14 Goals

✓ 5 Verified Achievements

[View Profile]

==================================================
29. FUTURE ROADMAP
==================================================

Do not implement these yet.

Show them only if needed in a roadmap section:

PHASE 1:
Local Sports Network

PHASE 2:
Verified Athlete Identity

PHASE 3:
Talent Discovery & Matching

PHASE 4:
Team Recruitment / Player Auctions

PHASE 5:
Multi-City Network

==================================================
30. PERFORMANCE
==================================================

Optimize for fast demo loading.

Avoid unnecessary libraries.

Avoid huge image files.

Use optimized placeholder/remote-safe imagery only where necessary.

Prefer CSS/UI elements over heavy assets.

The application must load reliably on a normal laptop browser.

==================================================
31. CODE QUALITY
==================================================

Use:

TypeScript
Reusable components
Reusable cards
Reusable forms
Reusable badges
Reusable layout components
Centralized constants
Clear data types
Clean folder structure

Avoid:

duplicated code
giant components
inline data scattered everywhere
hard-coded navigation
unnecessary dependencies

Create a clear separation between:

components
pages/routes
lib
services
types
data
firebase

==================================================
32. FOLDER STRUCTURE
==================================================

Prefer a structure similar to:

src/
  app/
  components/
    ui/
    layout/
    athlete/
    organizer/
    discovery/
    tournament/
  lib/
    firebase/
    services/
    utils/
  types/
  data/

Keep it clean and understandable.

==================================================
33. ERROR HANDLING
==================================================

If Firebase is unavailable:

Do not crash the application.

Use a local demo data adapter.

Structure data access so Firebase can replace the adapter later.

For example:

getAthlete()
getTournament()
getMatches()
verifyMatch()
searchAthletes()

Keep business logic separate from UI.

==================================================
34. IMPORTANT PROTOTYPE PRINCIPLE
==================================================

Do NOT create fake buttons.

Every button on the primary demo path must perform a meaningful action.

PRIMARY DEMO PATH:

Organizer login
→ tournament
→ match
→ scoring
→ finish
→ verification
→ athlete update
→ talent discovery
→ athlete profile

This path must be functional.

Secondary buttons may be simplified.

==================================================
35. DO NOT OVERBUILD
==================================================

If you have to choose between:

A beautiful but fake feature

and

A simple but functional feature

ALWAYS choose the functional feature.

If you have to choose between:

20 screens

and

10 connected screens

ALWAYS choose the connected screens.

If you have to choose between:

AI prediction

and

correct verified statistics

ALWAYS choose verified statistics.

==================================================
36. VISUAL DEMO PRIORITIES
==================================================

The following screens must receive the highest visual polish:

1. Landing Page
2. Athlete Profile
3. Tournament Details
4. Organizer Dashboard
5. Live Match Scoring
6. Result Verification
7. Talent Discovery

These are the screens likely to appear in our presentation.

==================================================
37. DEMO DATA CONSISTENCY
==================================================

Make sure the following numbers are internally consistent.

Aarav Sharma:

Before demo:
Tournaments = 8
Matches = 22
Wins = 15
Goals = 12
Verified Achievements = 4

During demo:
Match score = 3-1
Aarav goals = 2
Aarav is Player of Match
Aarav's team wins

After verification:

Tournaments = 8
Matches = 23
Wins = 16
Goals = 14
Verified Achievements = 5

Do not increment tournaments if the tournament was already counted.

==================================================
38. DEMO SAFETY
==================================================

Provide a reset mechanism for demo data.

Create either:

"Reset Demo"

or a developer/demo utility route.

This should restore:

Aarav:
22 matches
15 wins
12 goals
4 achievements

This allows repeated presentation rehearsals.

Do not expose the reset control prominently to normal users.

==================================================
39. FINAL ACCEPTANCE TEST
==================================================

Before declaring the MVP complete, test this exact scenario:

1. Open landing page.
2. Login as organizer.
3. Open Indore City Football Cup.
4. Open hero match.
5. Enter score 3-1.
6. Add Aarav's 2 goals.
7. Mark Aarav Player of Match.
8. Finish match.
9. Verify result.
10. Confirm athlete statistics update.
11. Confirm achievement appears.
12. Logout.
13. Login as scout.
14. Open Talent Discovery.
15. Filter:
    Football
    Indore
    U-19
    Forward
16. Find Aarav.
17. Open Aarav profile.
18. Confirm verified achievement is visible.

If any step fails, fix it before adding optional features.

==================================================
40. FINAL PRODUCT EXPERIENCE
==================================================

When the prototype is finished, a judge should immediately understand:

1. There is a real local sports discovery problem.
2. KheloLocal creates a city-level network.
3. Tournaments are the engine that generates sporting data.
4. Organizers verify that data.
5. Verified data strengthens athlete identity.
6. Teams/coaches/scouts can discover athletes.
7. The same architecture can eventually scale city by city.

The product should feel like:

"Something that could actually be launched in Indore."

Not:

"An AI-generated hackathon mockup."

==================================================
41. BUILD ORDER
==================================================

Build in this exact order:

PHASE 1:
Project foundation
- routing
- design system
- layout
- Firebase setup
- data types
- seed data

PHASE 2:
Authentication
- login
- signup
- role selection

PHASE 3:
Public experience
- landing
- tournament discovery
- tournament details

PHASE 4:
Athlete
- dashboard
- profile
- tournaments

PHASE 5:
Organizer
- dashboard
- create tournament
- manage tournament
- participants

PHASE 6:
Core engine
- fixtures
- live scoring
- result completion
- verification

PHASE 7:
Athlete data loop
- statistics update
- achievements
- verified profile

PHASE 8:
Talent discovery
- filters
- athlete cards
- public profile
- connection request

PHASE 9:
Polish
- loading states
- empty states
- error states
- responsive layout
- animations
- accessibility
- demo reset

==================================================
42. FINAL INSTRUCTION
==================================================

Start building KheloLocal now.

First create the application foundation and design system.

Then implement the MVP in the build order above.

Do not stop after generating static UI.

Connect the primary flows.

Prioritize the complete tournament → result → verification → athlete identity → talent discovery loop.

If a decision is not explicitly specified, choose the simplest implementation that preserves this product thesis.

Do not add features merely because they are common in sports apps.

Every feature must answer:

"Does this help create or connect local sporting activity?"

If not, leave it out of the MVP.

The final result should be a polished, responsive, functional KheloLocal MVP centered on Indore and ready for a live hackathon presentation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://khelolocal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/980160d6-6292-4b17-a813-683c2800a169).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
