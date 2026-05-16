type TutorWithProfile = {
  id: number;
  fullName: string;
  email: string;
  tutorProfile: {
    headline: string | null;
    bio: string | null;
    subjects: string[];
    yearsOfExperience: number | null;
    teachingModes: string[];
    isActive: boolean;
  } | null;
};

type TutorListItem = {
  id: number;
  fullName: string;
  email: string;
  headline: string | null;
  subjects: string[];
  yearsOfExperience: number | null;
  teachingModes: string[];
};

type TutorDetail = TutorListItem & {
  bio: string | null;
  profile: {
    isActive: boolean;
  };
};

export const mapTutorListItem = (user: TutorWithProfile): TutorListItem => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  headline: user.tutorProfile?.headline ?? null,
  subjects: user.tutorProfile?.subjects ?? [],
  yearsOfExperience: user.tutorProfile?.yearsOfExperience ?? null,
  teachingModes: user.tutorProfile?.teachingModes ?? [],
});

export const mapTutorDetail = (user: TutorWithProfile): TutorDetail => ({
  ...mapTutorListItem(user),
  bio: user.tutorProfile?.bio ?? null,
  profile: {
    isActive: user.tutorProfile?.isActive ?? false,
  },
});