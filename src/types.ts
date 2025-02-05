export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  labels: string[];
}

export interface Section {
  id: string;
  title: string;
  tasks: string[];
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    border: string;
    hover: string;
  };
}

export interface KanvasState {
  tasks: Record<string, Task>;
  sections: Record<string, Section>;
  sectionOrder: string[];
  theme: Theme;
}

export interface Kanvas {
  tasks: Record<string, Task>;
  sections: Record<string, Section>;
  sectionOrder: string[];
  theme: Theme;
  history: {
    past: KanvasState[];
    future: KanvasState[];
  };
}
