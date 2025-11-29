{
  description = "Node.js dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.yarn
            pkgs.prisma
            pkgs.nodejs_20
            pkgs.prisma-engines
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
          ];

          env = {
            PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine";
            PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine";
            PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node";
            PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt";
          };

          shellHook = ''echo "Node $(node -v) ready. Try not to break anything."'';
        };
      });
}
