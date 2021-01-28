// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type ZoomCredentials = {
  apiKey: string;
  secret: string;
};

export type RoomCredentials = {
  ID: number;
  passcode: string;
};
export type MeetingConfig = {
  meetingNumber: number;
  userName: string;
  signature: string;
  apiKey: string;
  passWord: string;
};

export type zoomID = string; // Email or zoomID
