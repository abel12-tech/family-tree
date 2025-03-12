"use client";

import { memo, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { FamilyMember } from '@/lib/types';
import { useFamilyTreeStore } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import EditMemberDialog from './edit-member-dialog';

interface FamilyMemberNodeProps {
  data: FamilyMember;
  selected?: boolean;
}

function FamilyMemberNode({ data, selected }: FamilyMemberNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteFamilyMember } = useFamilyTreeStore();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/familyMembers/${data.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete member');

      deleteFamilyMember(data.id);
      toast({
        title: "Member deleted",
        description: "Family member has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="group">
      <Handle type="target" position={Position.Top} />
      <Card className={`w-[250px] transition-all duration-300 ${
        selected ? 'ring-2 ring-primary' : ''
      } group-hover:shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data.imageUrl} alt={data.name} />
              <AvatarFallback>{data.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium leading-none mb-1">{data.name}</h3>
              <p className="text-sm text-muted-foreground">
                Born: {new Date(data.birthDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {data.gender}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <EditMemberDialog member={data} onClose={() => setIsEditing(false)}>
              <Button size="sm" variant="outline">
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </EditMemberDialog>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(FamilyMemberNode);