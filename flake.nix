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
            pkgs.nodejs_20 # change to nodejs_22 if you want
            pkgs.nodePackages.typescript-language-server
            pkgs.nodePackages.typescript
          ];

          shellHook = ''echo "Node $(node -v) ready."'';
        };
      });
}
