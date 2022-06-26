ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload \
 -e devnet \
 -k ~/.config/solana/devnet.json \
 -cp config.json \
 -c example \
 ./assets

    ts-node js/packages/cli/src/candy-machine-v2-cli.ts upload \
    -e devnet \
    -k ~/.config/solana/id.json \
    -cp config.json \
    -c example \
    ./js/assets


    ts-node js/packages/cli/src/candy-machine-v2-cli.ts upload \
    -e devnet \
    -k ~/.config/solana/id.json \
    -cp config.json \
    -c example \
    ./js/packages/cli/example-assets



    ## Fetch json and save to cache
    npx ts-node packages/cli/src/candy-machine-v2-cli.ts fetch_json -e devnet -c mermaid -cp mermaid-config.json

    ## upload json
    npx ts-node packages/cli/src/candy-machine-v2-cli.ts upload_json \
    -e devnet \
    -k ~/.config/solana/id.json \
    -cp mermaid-config.json \
    -c mermaid

    ## verify upload
    npx ts-node packages/cli/src/candy-machine-v2-cli.ts verify_upload \
    -e devnet \
    -k ~/.config/solana/id.json \
    -c mermaid

    ## mint
    npx ts-node packages/cli/src/candy-machine-v2-cli.ts mint_multiple_tokens \
    -e devnet \
    -k [your-wallet-file.json] \
    -c mermaid --number 1000

    ## withdraw
    npx ts-node packages/cli/src/candy-machine-v2-cli.ts withdraw <candy_machine_id> \
    -e devnet \
    -k [your-wallet-file.json]
