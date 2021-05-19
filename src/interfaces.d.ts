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

export interface ICustomer {
	id?: number;
	name?: string;
	phoneNumber?: string;
	email?: string;
	customerType?: string;
	notes?: string;
}

export interface IAssignment {
	id?: number;
	customerId?: number;
	userId?: number;
	fileNumber?: string;
	dueDate?: Date;
	notes?: string;
	contactName?: string;
	contactPhoneNumber?: string;
	contactEmail?: string;
	meetingAddress?: string;
	rate?: number;
	type?: string;
	status?: string;
}
