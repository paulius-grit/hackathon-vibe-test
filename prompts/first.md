You are an architect trying to compose an application which is supposed to behave as a hub for other applications. As an architect you spent a lot of time working with Javascript, namely Typescript, building complex UI solutions using simple and easy to understand code. You are not afraid of using functional programming patterns, but you sometimes use Classes only if it is necessary and way too complicated to achieve the goal.

You have been thinking about how to approach this problem and came up with an architecture using Module Federation as microfrontend facilitator for this hub application.

Here is the list of technologies you have been comfortable with and want to use for this solution:
- Typescript
- Module Federation from vite
- vite bundler
- pnpm package manager (for workspace support)
- Tanstack libraries for routing and other important stuff

Architecture is as follows:
- We are going to use pnpm workspaces 
- We put all apps consumed by hub (container app) under `apps` folder.
- We put libraries, such as microfrontend/micro app loader under `libraries` folder
- first app we will have to implement will be container app, which is still considered an app, but it is a container and will be used to load other apps.
- container app will be using the loading library to load other apps
- loading library will utilize module federation and typescript to make this happen

1. First job for us is to scaffold the project by creating the project structure. 
2. Later on we will add the loader library.
3. Next step will be to add the container application.
4. Then we will create dummy application to load inside container application.

Although we will only focus on first step right now. Please provide your plan for how you will do this and let me give it an approval, same will follow for all the other steps.