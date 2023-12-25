import { Component } from "vue";

export type WayPoint = {
  x: number;
  y: number;
  label: string;
};

export type Port = {
  id: number;
  type: "input" | "output";
  component: Component;
  name: string;
  pos: Position;
  value: number;
  connection?: any;
};

export type Icon = {
  type: "char" | "icon" | "value";
  text?: string;
};

export type ComponentProperties = {
  duration?: number;
  frequency?: number;
  description?: string;
  rom?: Object;
};

export interface IComponent {
  execute(): void;
}
