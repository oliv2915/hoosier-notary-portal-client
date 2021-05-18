export interface IUserContextUser {
	id?: number;
	email?: string;
	firstName?: string;
	middleName?: string | null;
	lastName?: string;
	suffix?: string | null;
	phoneNumber?: string;
	isNotary?: boolean;
	isActiveNotary?: boolean;
	isEmployee?: boolean;
	isActiveEmployee?: boolean;
	isSuper?: boolean;
}
