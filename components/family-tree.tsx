"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import { useFamilyTreeStore } from "@/lib/store";
import { FamilyNode, FamilyEdge } from "@/lib/types";
import FamilyMemberNode from "./family-member-node";
import { useToast } from "@/components/ui/toast";

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

export default function FamilyTree() {
  const { familyMembers, relationships, addRelationship } = useFamilyTreeStore();
  const { toast } = useToast();

  console.log("Family Members:", familyMembers);
  console.log("Relationships:", relationships);

  const generateInitialNodes = () => {
    return familyMembers.map((member, index) => ({
      id: member.id,
      type: "familyMember",
      data: member,
      position: { x: index * 250, y: Math.floor(index / 3) * 200 },
      draggable: true,
    }));
  };

  const generateInitialEdges = () => {
    return relationships.map((rel) => ({
      id: rel.id,
      source: rel.person1Id,
      target: rel.person2Id,
      type: "smoothstep",
      animated: true,
      label: rel.type,
    }));
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(generateInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateInitialEdges());

  useEffect(() => {
    setNodes(generateInitialNodes());
  }, [familyMembers]);

  useEffect(() => {
    setEdges(generateInitialEdges());
  }, [relationships]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      try {
        const newRelationship = {
          id: `${Date.now()}`,
          type: "parent",
          person1Id: connection.source,
          person2Id: connection.target,
        };

        const response = await fetch("http://localhost:3001/relationships", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRelationship),
        });

        if (!response.ok) throw new Error("Failed to create relationship");

        const savedRelationship = await response.json();
        addRelationship(savedRelationship);

        toast({
          title: "Relationship created",
          description: "Family members have been connected successfully.",
        });

        setEdges((eds) => [
          ...eds,
          {
            id: savedRelationship.id,
            source: connection.source!,
            target: connection.target!,
            type: "smoothstep",
            animated: true,
            label: "parent",
          },
        ]);
      } catch (error) {
        console.error("Error creating relationship:", error);
        toast({
          title: "Error",
          description: "Failed to create relationship. Please try again.",
          variant: "destructive",
        });
      }
    },
    [addRelationship, setEdges, toast]
  );

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background gap={16} size={1} />
        <Controls />
        {/* <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === "familyMember") return "#000";
            return "#eee";
          }}
          nodeColor={(n) => {
            return n.data.gender === "male" ? "#3b82f6" : "#ec4899";
          }}
        /> */}
      </ReactFlow>
    </div>
  );
}
