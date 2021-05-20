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

export interface ICommission {
	id?: number;
	userId?: number;
	commissionNumber?: string;
	nameOnCommission?: string;
	commissionExpireDate?: Date;
	commissionState?: string;
	countyOfResidence?: string;
}

export interface IAddress {
	id?: number;
	userId?: number;
	customerId?: number;
	streetOne?: string;
	streetTwo?: string;
	city?: string;
	state?: string;
	zipCode?: number;
	type?: string;
}
export interface ICustomer {
	id?: number;
	name?: string;
	phoneNumber?: string;
	email?: string;
	customerType?: string;
	notes?: string;
}

export interface ICustomerContact {
	id?: number;
	customerId?: number;
	name?: string;
	email?: string;
	phoneNumber?: string;
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
