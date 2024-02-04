export const toBool = (value: string): boolean => {
    switch (value) {
        case 'true':
            return true
        default:
            return false
    }
}

export const getPaths = (release_artifacts: string) => release_artifacts
    .split(/\n|,\s?/)
    .map((path) => path.trim())
    .filter(s => s)

export const getFilename = (path: string) => {
    const m = path.match(/(?<name>[\.\w-]+$)/)
    if (!m) throw new Error(`Could match file name "${path}"`)
    return m.groups.name
}

export const getVersionedFilename = (path: string, version: string) => {
    const m = getFilename(path).match(/^(?<name>\.?[\w-]+)(?<ext>\.\w*)?$/)
    if (!m) throw new Error(`Could not version filename`)
    return `${m.groups.name}_${version}${m.groups.ext ?? ''}`
}
