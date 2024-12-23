// src/config/app.config.ts
import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
import { TEnv } from '../interfaces/env.type';

export class ContainerConfig {
	private static instance: ContainerConfig;
	private appContainer: DependencyContainer;

	private constructor() {
		this.appContainer = container;
	}

	public static initialize(env: TEnv): ContainerConfig {
		if (!this.instance) {
			this.instance = new ContainerConfig();
			this.instance.registerEnv(env);
			this.instance.registerDependencies();
		}
		return this.instance;
	}

	public static getInstance(): ContainerConfig {
		if (!this.instance) {
			throw new Error('AppConfig is not initialized. Call AppConfig.initialize first.');
		}
		return this.instance;
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	public resolve<T>(token: string | symbol | (new (...args: any[]) => T)): T {
		return this.appContainer.resolve(token);
	}

	private registerDependencies(): this {
		const dependencies: any[] = Reflect.getMetadata('design:type', container) || [];
		dependencies
			.filter((dependency: any) => !this.appContainer.isRegistered(dependency))
			.forEach((dependency: any) => this.appContainer.registerSingleton(dependency));
		return this;
	}

	private registerEnv(env: TEnv): this {
		this.appContainer.registerInstance('env', env);
		return this;
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const resolve = <T>(token: new (...args: any[]) => T): T => {
	return ContainerConfig.getInstance().resolve(token);
};
