import type { DocumentSnapshot } from 'firebase/firestore/lite';

export default class Gaikole {
  public id: string;
  public departurePoint: string;
  public numberOfPeople: number;
  public departureTime: Date;
  public authorUid: string;
  public authorName: string;
  public phoneNumber: string;

  constructor(
    id: string,
    departurePoint: string,
    numberOfPeople: number,
    departureTime: Date,
    authorUid: string,
    authorName: string,
    phoneNumber: string
  ) {
    this.id = id;
    this.departurePoint = departurePoint;
    this.numberOfPeople = numberOfPeople;
    this.departureTime = departureTime;
    this.authorUid = authorUid;
    this.authorName = authorName;
    this.phoneNumber = phoneNumber;
  }

  public static fromDoc(doc: DocumentSnapshot): Gaikole {
    const data = doc.data();
    return new Gaikole(
      doc.id,
      data!.departurePoint as string,
      data!.numberOfPeople as number,
      data!.departureTime.toDate() as Date,
      data!.authorUid as string,
      data!.authorName as string,
      data!.phoneNumber as string
    );
  }
}
