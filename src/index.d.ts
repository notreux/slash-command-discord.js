declare module 'slash-command-discord.js' {
	import { Client, Channel, Guild, GuildMember } from 'discord.js';

	export type ApplicationCommandOptionChoice = {
		name: string,
		value: string | number
	}

	export type ApplicationCommandOption = {
		type: number,
		name: string,
		description: string,
		required: boolean,
		choices: [ApplicationCommandOptionChoice],
		options: [ApplicationCommandOption]
	}

	export type ApplicationCommand = {
		name: string,
		description: string,
		options: [ApplicationCommandOption],
		default_permission: boolean
	}

	export type Interaction = {
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
	
	export type types = "subCommand" | "subCommandGroup" | "string" | "integer" | "boolean" | "user" | "channel" | "role"

	// Module Methods
	export function post(client:Client): void;
	/**
	 * 
	 * @param guildId Guild ID to fetch commands from
	 */
	export function getPostedCommands(client: Client, guildId?: string): Promise<ApplicationCommand[]>;
	/**
	 * 
	 * @param guildId Guild ID to delete commands from
	 */
	export function removeCommand(client: Client, id: string, guildId: string): void;

	// Module Events
	export function onSlashCommand(client: Client,
		func: (
			command: slashMessage,
			interaction: Interaction) => void
			): slashMessage;

	export class slashMessage {
		constructor(interaction:Interaction, client:Client)

		public readonly name: string;
		public readonly id: string;
		public readonly interaction: Interaction;
		public readonly createdAt: Date;
		public readonly client: Client;
		public readonly channel: Channel|undefined;
		public readonly guild: Guild|undefined;
		public readonly member: GuildMember|undefined;
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

		public addOption(opt:slashOption|subCommandGroup|subCommand):void
	}

	export class subCommandGroup extends SlashBaseModule {
		constructor();

		addSubCommand(opt:subCommand)
	}

	export class subCommand extends SlashBaseModule {
		constructor();

		addOption(opt:slashOption)
	}

	export class slashOption extends SlashBaseModule {
		constructor();

		setType(type: types): void;
		isRequired(enabled: boolean): void;
		addChoice(name: string, value: string): void
	}
}
