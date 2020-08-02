import type { Sprite } from "./types"


interface Animations {
	[animationName: string]: {
		framesPerSecond: number,
		frames: Sprite[]
	}
}


export default class Animator {
	private _animations: Animations
	private _currentAnimation: string
	private _frameCounter: number = 0

	public constructor(animations: Animations, initialAnimation: string) {
		this._animations = animations
		this.ensureAnimation(initialAnimation)
		this._currentAnimation = initialAnimation
	}

	public onUpdate(delta: number) {
		const currentAnimation = this._animations[this._currentAnimation]
		this._frameCounter = (this._frameCounter + delta * currentAnimation.framesPerSecond) % currentAnimation.frames.length
	}

	public setAnimation(animation: string, resetFrames = true) {
		if (this._currentAnimation === animation) {
			return
		}

		this.ensureAnimation(animation)
		this._currentAnimation = animation
		if (resetFrames) {
			this._frameCounter = 0
		}
	}

	public getSprite() {
		const currentFrame = Math.floor(this._frameCounter)
		return this._animations[this._currentAnimation].frames[currentFrame]
	}

	private ensureAnimation(animation: string) {
		if (!this._animations[animation]) {
			throw new AnimationError(`No animation with name ${animation} found!`)
		}
	}
}


class AnimationError extends Error {}
