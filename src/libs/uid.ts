let lastUid = 0

export const genUid = () => `uid-${++lastUid}`
