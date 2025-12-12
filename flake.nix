{
  description = "A simple TypeScript Dev Environment";

  # Get the latest packages
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      # If you are on an M1/M2 Mac, change this to "aarch64-darwin"
      # If you are on standard Intel/AMD Linux, keep as is:
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        # The packages we want available in our environment
        packages = with pkgs; [
          nodejs_20
          typescript
          typescript-language-server
        ];

        # Optional: Runs when you enter the shell
        shellHook = ''
          echo "Environment loaded: Node, TS, and LSP are ready!"
        '';
      };
    };
}
