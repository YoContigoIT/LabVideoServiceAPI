export enum OpenViduWebHookEventTypes {
    sessionCreated = 'sessionCreated',
    sessionDestroyed = 'sessionDestroyed',
    participantJoined = 'participantJoined',
    participantLeft = 'participantLeft',
    webrtcConnectionCreated = 'webrtcConnectionCreated',
    webrtcConnectionDestroyed = 'webrtcConnectionDestroyed',
    recordingStatusChanged = 'recordingStatusChanged',
    filterEventDispatched = 'filterEventDispatched',
    signalSent = 'signalSent',
}

export enum RecordingStatusChangedStatusTypes {
    started = "started",
    stopped = "stopped",
    ready = "ready",
    failed = "failed",
}

export enum RecordingStatusChangedReasonTypes {
    recordingStoppedByServer = "recordingStoppedByServer",
    lastParticipantLeft = "lastParticipantLeft",
    sessionClosedByServer = "sessionClosedByServer",
    mediaServerDisconnect = "mediaServerDisconnect",
    mediaServerReconnect = "mediaServerReconnect",
    nodeCrashed = "nodeCrashed",
    openviduServerStopped = "openviduServerStopped",
    automaticStop = "automaticStop", 
}

export type RecordingStatusChangedEvent = {
    sessionId: string
    startTime: number
    duration: number
    reason: RecordingStatusChangedReasonTypes
    id: string
    name: string
    outputMode: string
    resolution: string
    recordingLayout: string
    hasAudio: boolean
    hasVideo: boolean
    size: number
    status: RecordingStatusChangedStatusTypes
}


export interface OpenViduWebHookEvent extends Partial<RecordingStatusChangedEvent> {
    event: OpenViduWebHookEventTypes;
    timestamp: number;
}