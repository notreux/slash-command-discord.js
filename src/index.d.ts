declare module 'slash-command-discord.js' {
	import { Client } from 'discord.js';

	// Module Methods
	export function post(client:Client): void;
	/**
	 * 
	 * @param guildId Guild ID to fetch commands from
	 */
	export function getPostedCommands(client: Client, guildId?: string): Promise<[ApplicationCommand]>;
	/**
	 * 
	 * @param guildId Guild ID to delete commands from
	 */
	export function removeCommand(client: Client, id: string, guildId: string): void;

	// Module Events
	export function onSlashCommand(client: Client,
		func: (
			command: slashMessage,
			interaction: InteractionInterface) => void
			): slashMessage;

	export class slashMessage {
		constructor(interaction:InteractionInterface, client:Client)

		public readonly name: string;
		public readonly id: string;
		public readonly interaction: InteractionInterface;
		public readonly createdAt: Date;
		public readonly client: Client
		public reply(msg:string):void
	}

	export class SlashBaseModule {
		protected data: {
			name: string | null,
			description: string | null
		};
		public setName(name: string): void;
		public setDescription(description: string): void;
	}

	export class command extends SlashBaseModule {
		/**
		 * 
		 * @param guildId Guild ID to assign command to
		 */
		constructor(guildId?: string);

		protected option: [];
		public addOption(opt:slashOption):void
	}

	export class slashOption extends SlashBaseModule {
		constructor();

		setType(type: string): void;
		isRequired(enabled: boolean): void;
		addChoice(name: string, value: string): void
	}

	interface ApplicationCommandOptionChoice {
		name: string,
		value: string | number
	}

	interface ApplicationCommandOption {
		type: number,
		name: string,
		description: string,
		required: boolean,
		choices: [ApplicationCommandOptionChoice],
		options: [ApplicationCommandOption]
	}

	interface ApplicationCommand {
		name: string,
		description: string,
		options: [ApplicationCommandOption],
		default_permission: boolean
	}

	interface InteractionInterface {
		type: number,
		token: string,
		member: {
			user: {
				id: number,
				username: string,
				avatar: string,
				discriminator: string,
				public_flags: number
			},
			roles: [string],
			premium_since: Date | null,
			permissions: string,
			pending: boolean,
			nick: string | null,
			mute: boolean,
			joined_at: Date,
			is_pending: boolean,
			deaf: boolean
		},
		id: string,
		guild_id: string,
		data: {
			options: [{
				name: string,
				value: string
			}],
			name: string,
			id: string
		},
		channel_id: string
	}
}
