import { Certificate } from "./certificate"

export interface Template {
    id: string
    name: string
    certificates: Certificate[]
    created_at: string
}