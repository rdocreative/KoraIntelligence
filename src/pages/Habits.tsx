"use client";

import React from 'react';
import { useHabitTracker } from "../hooks/useHabitTracker";
import HabitStats from "../components/habits/HabitStats";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const HabitsPage = () => {
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabitTracker();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Hábitos</h1>
          <p className="text-muted-foreground">Gerencie sua rotina e acompanhe seu progresso.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Novo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Hábito</DialogTitle>
            </DialogHeader>
            <HabitForm 
              onSuccess={() => setIsAddDialogOpen(false)} 
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <HabitStats habits={habits} />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="daily">Diários</TabsTrigger>
          <TabsTrigger value="weekly">Semanais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <HabitList habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitsPage;