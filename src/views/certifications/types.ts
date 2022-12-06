import type { CertificationProgram } from './schemas/certification-program'

export type { CertificationProgram }
export interface CertificationProgramItem {
	slug: string
	pageContent: CertificationProgram
}
