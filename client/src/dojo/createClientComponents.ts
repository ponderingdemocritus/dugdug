import { ContractComponents } from "./bindings/typescript/models.gen";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
  contractComponents,
}: {
  contractComponents: ContractComponents;
}) {
  return {
    ...contractComponents,
  };
}
