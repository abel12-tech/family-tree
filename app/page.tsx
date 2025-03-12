"use client";

import { useEffect } from 'react';
import { useFamilyTreeStore } from '@/lib/store';
import FamilyTree from '@/components/family-tree';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddMemberDialog from '@/components/add-member-dialog';

export default function Home() {
  const { setFamilyMembers, setRelationships } = useFamilyTreeStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, relationshipsRes] = await Promise.all([
          fetch('http://localhost:3001/familyMembers'),
          fetch('http://localhost:3001/relationships'),
        ]);
        
        const members = await membersRes.json();
        const relationships = await relationshipsRes.json();

        // console.log('MEMENEF',members)
        
        setFamilyMembers(members);
        setRelationships(relationships);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setFamilyMembers, setRelationships]);

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Family Tree</h1>
          <AddMemberDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </AddMemberDialog>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <FamilyTree />
      </div>
    </main>
  );
}