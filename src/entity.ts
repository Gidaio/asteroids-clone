import type { Input } from "./types"


export default abstract class Entity {
	public abstract readonly type: string

	public update(delta: number, input: Input): void {}
}
