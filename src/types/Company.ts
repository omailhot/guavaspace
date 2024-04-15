import * as v from 'valibot';

export const CompanySchema = v.object({
  companyId: v.string(),

  companyName: v.string(),
  description: v.optional(v.string()),
  companyLogoPath: v.string(),
});
export type CompanyType = v.Output<typeof CompanySchema>;
