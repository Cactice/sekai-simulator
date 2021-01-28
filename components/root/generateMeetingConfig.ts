import { MeetingConfig, RoomCredentials, ZoomCredentials } from "interfaces";

export const generateMeetingConfig = (
  roomCredentials: RoomCredentials,
  managerName: string,
  zoomCredentials: ZoomCredentials
) => {
  return new Promise<MeetingConfig>(async function (resolve, reject) {
    let { ZoomMtg } = await import("@zoomus/websdk");
    ZoomMtg.generateSignature({
      meetingNumber: roomCredentials.ID.toString(),
      apiKey: zoomCredentials.apiKey,
      apiSecret: zoomCredentials.secret,
      role: "10",
      success: (res: { result: string }) => {
        const signature = res.result;
        const meetingConfig: MeetingConfig = {
          meetingNumber: roomCredentials.ID,
          userName: managerName,
          signature: signature,
          apiKey: zoomCredentials.apiKey,
          passWord: roomCredentials.passcode,
        };
        resolve(meetingConfig);
      },
      error: (res: Error) => {
        reject(res);
      },
    });
  });
};
