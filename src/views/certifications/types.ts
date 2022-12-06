/**
 * TODO: should use zod schema to define this type, I think?
 */
export type CertificationProgram = Record<string, $TSFixMe>

export interface CertificationProgramItem {
	slug: string
	pageContent: CertificationProgram
}
