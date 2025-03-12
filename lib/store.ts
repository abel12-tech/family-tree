import { create } from 'zustand';
import { FamilyMember, Relationship } from './types';

interface FamilyTreeState {
  familyMembers: FamilyMember[];
  relationships: Relationship[];
  selectedMember: FamilyMember | null;
  setFamilyMembers: (members: FamilyMember[]) => void;
  setRelationships: (relationships: Relationship[]) => void;
  setSelectedMember: (member: FamilyMember | null) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (member: FamilyMember) => void;
  deleteFamilyMember: (id: string) => void;
  addRelationship: (relationship: Relationship) => void;
  removeRelationship: (id: string) => void;
}

export const useFamilyTreeStore = create<FamilyTreeState>((set) => ({
  familyMembers: [],
  relationships: [],
  selectedMember: null,
  setFamilyMembers: (members) => set({ familyMembers: members }),
  setRelationships: (relationships) => set({ relationships }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  addFamilyMember: (member) =>
    set((state) => ({ familyMembers: [...state.familyMembers, member] })),
  updateFamilyMember: (member) =>
    set((state) => ({
      familyMembers: state.familyMembers.map((m) =>
        m.id === member.id ? member : m
      ),
    })),
  deleteFamilyMember: (id) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter((m) => m.id !== id),
      relationships: state.relationships.filter(
        (r) => r.person1Id !== id && r.person2Id !== id
      ),
    })),
  addRelationship: (relationship) =>
    set((state) => ({
      relationships: [...state.relationships, relationship],
    })),
  removeRelationship: (id) =>
    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== id),
    })),
}));