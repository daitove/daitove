import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type Firestore,
  type QueryConstraint,
  type QueryDocumentSnapshot
} from 'firebase/firestore/lite';

import Daitove from '$lib/classes/Daitove';

export default class DaitoveFetcher {
  private lastFetchedDoc: QueryDocumentSnapshot | undefined;

  constructor() {}

  public async fetch(
    firestore: Firestore,
    lim: number = 36,
    ...constraints: QueryConstraint[]
  ): Promise<{ [key: string]: Daitove }> {
    const snapshot = await getDocs(
      query(
        collection(firestore, 'daitove'),
        where('tillDate', '>', Timestamp.now()),
        orderBy('fromDate'),
        ...(this.lastFetchedDoc ? [startAfter(this.lastFetchedDoc)] : []),
        limit(lim),
        ...constraints
      )
    );

    this.lastFetchedDoc = snapshot.docs[snapshot.docs.length - 1];

    const daitoves: { [key: string]: Daitove } = {};
    snapshot.forEach((doc) => (daitoves[doc.id] = Daitove.fromDoc(doc)));

    return daitoves;
  }
}
