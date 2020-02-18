export class UserProfile {
  userId: string;
  userName: string;
}

export class AppUser
{
    userCode: string;
    password: string;
}

export class LoginResponse
{
    userId: number;
    langID: number;
    title: string;
    defReceivingLocID: number;
    userFirstName: string;
    userLastName: string;
    defERPCompanyID: number;
    timeOutApp: number;
    token: string;
    logisticSiteClaims: { [key: string]: WmsClaim[] };
    erpClaims: { [key: number]: WmsClaim[] };
    roles: string[];
}

export interface WmsClaim
{
    type: string;
    value: string;
}
