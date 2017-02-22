export interface Word{
	id: number;
	list: number;
	name: string;
	explainnation: any;
	createdAt: string;
	updatedAt: string;
}

export interface Vocabulary{
	id: number;
	name: string;
	description: string;
	word: Word[];
	cover: string;
	currentProcess: number;
	createdAt: string;
	updatedAt: string;
}

export interface Set{
	explainnation: string;
	isTrue: boolean;
}

export interface Problem{
	name: string;
	set: Set[];
}