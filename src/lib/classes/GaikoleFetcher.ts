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

import Gaikole from '$lib/classes/Gaikole';

export default class GaikoleFetcher {
  private lastFetchedDoc: QueryDocumentSnapshot | undefined;

  constructor() {}

  public async fetch(
    firestore: Firestore,
    lim: number = 36,
    ...constraints: QueryConstraint[]
  ): Promise<{ [key: string]: Gaikole }> {
    const snapshot = await getDocs(
      query(
        collection(firestore, 'gaikole'),
        where('departureTime', '>', Timestamp.now()),
        orderBy('departureTime'),
        ...(this.lastFetchedDoc ? [startAfter(this.lastFetchedDoc)] : []),
        limit(lim),
        ...constraints
      )
    );

    this.lastFetchedDoc = snapshot.docs[snapshot.docs.length - 1];

    const gaikoles: { [key: string]: Gaikole } = {};

    snapshot.forEach((doc) => {
      gaikoles[doc.id] = Gaikole.fromDoc(doc);
    });

    return gaikoles;
  }
}
