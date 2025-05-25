{
	description = "Flake for Studying HTML";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
	};

	outputs = { self, nixpkgs }@inputs:
	let
		system = "x86_64-linux";
		
		pkgs = import inputs.nixpkgs{
			inherit system;
			config.allowUnfree = true;
		};
	in 
	{
		devShells.${system}.default = pkgs.mkShell rec {
			packages = with pkgs; [
				nodejs
				];
			shellHook = ''
				tmux new-session -A -s Greenrally
				npx serve
				'';
			};
		};
	}
