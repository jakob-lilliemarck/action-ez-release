import type { WebhookPayload } from '@actions/github/lib/interfaces';

export const boolean = (value: string): boolean => {
    switch (value) {
        case 'true':
            return true
        default:
            return false
    }
}

export const getPaths = (release_artifacts: string) => release_artifacts.split(/,\s?/).map((path) => path.trim())

export const getRepositoryInformation = (payload: WebhookPayload) => {
    if (!payload.repository) throw new Error(`No key "repository" in payload: \n${JSON.stringify(payload, null, 4)}`)
    const { owner: { name }, full_name } = payload.repository
    if (!(name && full_name)) throw new Error(`Could not extract required information from the pau`)
    return { owner: name, repo: full_name }
}

export const getFilename = (path: string) => {
    const { filename } = path.match(/(?<filename>[\w-]+\.?\w+$)/).groups
    if (!filename) throw new Error(`Could not get filename from path "${path}"`)
    return filename
}

export const getVersionedFilename = (path: string, version: string) => {
    return getFilename(path).replace(/(?=\.)/, `-${version}`)
}
