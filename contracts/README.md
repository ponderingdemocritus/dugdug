## Running Locally

#### Terminal one (Make sure this is running)

```bash
# Run Katana
katana --disable-fee --allowed-origins "*"
```

#### Terminal two

```bash
# Build the example
sozo build

# Migrate the example
sozo migrate apply

# Start Torii
torii --world 0x403b5f047b8c4797139e30801e310473d99ca6877d19e0f27506f353f8f70f7 --allowed-origins "*"
```

sozo build --typescript --manifest-path /Users/os/Documents/code/loaf/digdug/contracts/Scarb.toml
