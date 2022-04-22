public with sharing class pokemonController {
    private static final String POKEMON_URL = 'https://pokeapi.co/api/v2/';
    private static final String POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

    public static void fetchPokemonData(){
        HttpResponse response = getResponse('https://pokeapi.co/api/v2/pokemon?limit=1126');
        Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        Map<String, Object> pokemonMap = new Map<String, Object>();
        List<Pokemon__c> pokemonList = new List<Pokemon__c>();
        for (Object rawPokemon : (List<Object>)results.get('results')) {
            Pokemon__c pokemon = new Pokemon__c();
            pokemonMap = (Map<String, Object>)rawPokemon;
            pokemon.name = (String)pokemonMap.get('name');
            pokemon.Pokedex_Number__c = Integer.valueOf(pokemonMap.get('url').toString().split('/')[6].trim());
            pokemon.Pokemon_Image_Url__c = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemon.Pokedex_Number__c + '.png';
            pokemonList.add(pokemon);
        }
        upsert pokemonList Pokedex_Number__c;
    }

    private static HttpResponse getResponse(String url){
        Http client = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        HttpResponse response = client.send(request);
        return response;
    }

    @AuraEnabled(cacheable= true)
    public static List<Object> getAllPokemons(){
        List<Object> pokemons = [SELECT Name, Pokedex_Number__c, Pokemon_Image_Url__c FROM Pokemon__c ORDER BY Pokedex_Number__c ASC];
        return pokemons;
    }
}
