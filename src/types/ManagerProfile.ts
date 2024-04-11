import * as v from 'valibot';

import { CompanySchema } from './Company';

export const ManagerProfileSchema = v.object({
  managerProfileId: v.string(),
  cognitoUserId: v.string(),
  company: CompanySchema,
});
export type ManagerProfileType = v.Output<typeof ManagerProfileSchema>;
