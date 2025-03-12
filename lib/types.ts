export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  imageUrl: string;
  parentIds: string[];
}

export interface Relationship {
  id: string;
  type: 'spouse' | 'parent' | 'child';
  person1Id: string;
  person2Id: string;
}

export interface FamilyNode {
  id: string;
  type: 'familyMember';
  data: FamilyMember;
  position: { x: number; y: number };
}

export interface FamilyEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated?: boolean;
}