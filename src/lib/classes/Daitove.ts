import type { DocumentSnapshot } from 'firebase/firestore/lite';

export default class Daitove {
  public id: string;
  public numberOfPeople: number;
  public fromDate: Date;
  public tillDate: Date;
  public district: string;
  public foodIncluded: boolean;
  public authorUid: string;
  public authorName: string;
  public phoneNumber: string;

  constructor(
    id: string,
    numberOfPeople: number,
    fromDate: Date,
    tillDate: Date,
    district: string,
    foodIncluded: boolean,
    authorUid: string,
    authorName: string,
    phoneNumber: string
  ) {
    this.id = id;
    this.numberOfPeople = numberOfPeople;
    this.fromDate = fromDate;
    this.tillDate = tillDate;
    this.district = district;
    this.foodIncluded = foodIncluded;
    this.authorUid = authorUid;
    this.authorName = authorName;
    this.phoneNumber = phoneNumber;
  }

  public static fromDoc(doc: DocumentSnapshot) {
    const data = doc.data();
    return new Daitove(
      doc.id,
      data!.numberOfPeople as number,
      data!.fromDate.toDate() as Date,
      data!.tillDate.toDate() as Date,
      data!.district as string,
      data!.foodIncluded as boolean,
      data!.authorUid as string,
      data!.authorName as string,
      data!.phoneNumber as string
    );
  }
}
