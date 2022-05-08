// https://github.com/TehNut/svelte-floating-ui

import type { ComputePositionConfig, ComputePositionReturn, Middleware, Padding } from '@floating-ui/core';
import { arrow as arrowCore } from "@floating-ui/core";
import { computePosition } from "@floating-ui/dom";
import type { Writable } from "svelte/store";
import { get } from 'svelte/store';

type ComputeConfig = Omit<ComputePositionConfig, "platform"> & { 
  onComputed?: (computed: ComputePositionReturn) => void
};
type UpdatePosition = (contentOptions?: ComputeConfig) => void;
type ReferenceAction = (node: HTMLElement) => void;
type ContentAction = (node: HTMLElement, contentOptions?: ComputeConfig) => void;
type ArrowOptions = { padding?: Padding, element: Writable<HTMLElement> };

export function createFloatingActions(initOptions?: ComputeConfig): [ ReferenceAction, ContentAction, UpdatePosition ] {
  let referenceElement: HTMLElement;
  let contentElement: HTMLElement;
  let options: ComputeConfig | undefined = initOptions;

  const updatePosition = (updateOptions?: ComputeConfig) => {
    if (referenceElement && contentElement) {
      options = { ...initOptions, ...updateOptions };
      computePosition(referenceElement, contentElement, options)
        .then(v => {
          Object.assign(contentElement.style, {
            position: v.strategy,
            left: `${v.x}px`,
            top: `${v.y}px`,
          });

          options.onComputed && options.onComputed(v);
        });
    }
  }

  const referenceAction: ReferenceAction = node => {
    referenceElement = node;
    updatePosition();
  }

  const contentAction: ContentAction = (node, contentOptions?) => {
    contentElement = node;
    options = { ...initOptions, ...contentOptions };
    updatePosition();
    return {
      update: updatePosition
    }
  }

  return [
    referenceAction, // Action to set the reference element
    contentAction, // Action to set the content element and apply config overrides
    updatePosition // Method to update the content position
  ]
}

export function arrow(options?: ArrowOptions): Middleware {
  return {
    name: "arrow",
    options,
    fn(args) {
      const element = get(options.element);

      if (element) {
        return arrowCore({
          element,
          padding: options.padding
        }).fn(args);
      }

      return {};
    }
  }
}