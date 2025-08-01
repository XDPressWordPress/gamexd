# Super Jump 2D - Jogo de Plataforma

## Overview

Este é um jogo de plataforma 2D divertido e simples construído com React e Canvas HTML5. O jogo apresenta um personagem que pode pular entre plataformas, coletar moedas, derrotar inimigos e avançar através de portais para novos níveis. Inclui uma arquitetura fullstack completa com frontend React usando Canvas 2D para gráficos, backend Express.js com integração PostgreSQL via Drizzle ORM, e componentes UI construídos com Radix UI e Tailwind CSS.

## Recent Changes (01/08/2025)

- **Migração de 3D para 2D**: Convertido de React Three Fiber para Canvas HTML5 nativo para melhor performance
- **Sistema de Combate**: Implementado mecânica de stomping - pular em cima dos inimigos os mata e dá pontos
- **Sistema de Níveis**: Adicionado portal que aparece quando todas as moedas são coletadas
- **Interface em Português**: Toda a UI traduzida para português brasileiro
- **Mecânicas Aprimoradas**: Física de pulo realista, câmera que segue o jogador, animações fluidas
- **Créditos Implementados**: Adicionada tela de créditos da XD Plans e David Xavier, visível no menu e durante o jogo
- **Otimização Mobile**: Controles touch implementados com botões visuais para movimento e pulo
- **Branding Background**: XD Plans e David Xavier aparecem como marca d'água no fundo do jogo
- **Interface Mobile**: Botões maiores, CSS otimizado para telas touch, controles responsivos

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **3D Graphics**: React Three Fiber ecosystem including @react-three/drei for utilities and @react-three/postprocessing for visual effects
- **State Management**: Zustand with subscribeWithSelector middleware for game state, audio controls, and user interface state
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives for accessible, unstyled components with custom styling
- **Build Tool**: Vite with React plugin, GLSL shader support, and runtime error overlay for development

### Backend Architecture
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for REST API endpoints and static file serving
- **Database ORM**: Drizzle with PostgreSQL dialect for type-safe database operations
- **Development**: TSX for TypeScript execution and hot reloading
- **Production Build**: ESBuild for server bundling with external packages

### Game Architecture
- **3D Rendering**: Three.js scene with custom camera controls, lighting setup, and shadow mapping
- **Physics**: Custom physics implementation for player movement, jumping, and collision detection
- **Input Handling**: Keyboard controls via @react-three/drei with touch controls for mobile devices
- **Audio System**: HTML5 Audio API with mute controls and sound effect management
- **Game Logic**: Procedural generation for platforms, obstacles, and collectibles with scoring system

### State Management
- **Game State**: Zustand store managing game phases (ready/playing/ended), score tracking, and high score persistence
- **Audio State**: Separate store for audio assets, mute controls, and sound playback functions
- **Local Storage**: High score persistence and user preferences

### UI/UX Design
- **Responsive Design**: Mobile-first approach with touch controls and viewport optimization
- **Component System**: Modular UI components with consistent styling and accessibility features
- **Game Interface**: Overlay UI for game controls, score display, and menu screens
- **Visual Effects**: 3D post-processing effects and smooth camera transitions

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations with schema-first approach
- **Migration System**: Drizzle Kit for database schema management and migrations

### 3D Graphics and Game Development
- **Three.js**: Core 3D graphics library via @react-three/fiber wrapper
- **React Three Ecosystem**: @react-three/drei for utilities, @react-three/postprocessing for effects
- **GLSL Shaders**: Custom shader support via vite-plugin-glsl

### UI and Styling
- **Radix UI**: Complete set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Fonts**: Inter font family via @fontsource/inter

### Development and Build Tools
- **TypeScript**: Static typing for enhanced developer experience
- **Vite**: Fast build tool with Hot Module Replacement
- **ESBuild**: Production bundling for server-side code
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### State and Data Management
- **Zustand**: Lightweight state management with TypeScript support
- **TanStack Query**: Server state management for API calls (configured but not actively used)
- **React Hook Form**: Form handling with validation support

### Asset Management
- **GLTF/GLB Models**: 3D model support for game assets
- **Audio Files**: MP3, OGG, WAV format support for game sounds
- **Texture Assets**: Image assets for 3D materials and UI elements