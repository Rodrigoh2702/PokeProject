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

    @AuraEnabled(cacheable = true)
    public static Pokemon__c fetchMoreInfo(String pokedexNumber){
        Integer pokedexInt = Integer.valueOf(pokedexNumber);
        Pokemon__c pokemon = [SELECT Id, Name, Pokedex_Number__c, Height__c, Weight__c,
                            HP__c, Attack__c, Defense__c, Special_Attack__c, Special_Defense__c, Speed__c, Type__c 
                            FROM Pokemon__c WHERE Pokedex_Number__c = :pokedexInt LIMIT 1];
        if (pokemon.Height__c == null) {
            HttpResponse response = getResponse('https://pokeapi.co/api/v2/pokemon/' + pokedexNumber);
            Map<String, Object> pokemonInfo = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> pokemonStats = (List<Object>) pokemonInfo.get('stats');
            List<Integer> stats = new List<Integer>();
            List<Object> pokemonTypes = (List<Object>) pokemonInfo.get('types');
            for (Object stat : pokemonStats) {
                Map<String, Object> statMap = (Map<String, Object>) stat;
                Map<String, Object> statName = (Map<String, Object>) statMap.get('stat');
                stats.add((Integer)statMap.get('base_stat'));
            }
            Map<String, Object> hpStat = (Map<String, Object>) pokemonStats[0];
            pokemon.Height__c = (Double)pokemonInfo.get('height');
            pokemon.Weight__c = (Double)pokemonInfo.get('weight');
            pokemon.HP__c = stats[0];
            pokemon.Attack__c = stats[1];
            pokemon.Defense__c = stats[2];
            pokemon.Special_Attack__c = stats[3];
            pokemon.Special_Defense__c = stats[4];
            pokemon.Speed__c = stats[5];
            String pokemonType = '';
            Integer i = 0;
            for (Object type : pokemonTypes) {
                Map<String, Object> typeMap = (Map<String, Object>) type;
                Map<String, Object> typeName = (Map<String, Object>) typeMap.get('type');
                pokemonType += typeName.get('name');
                if (++i < pokemonTypes.size()) {
                    pokemonType += ';';
                }
            }
            pokemon.Type__c = pokemonType;
            upsert pokemon;
        }   
        return pokemon;
        
    }

    private static HttpResponse getResponse(String url){
        Http client = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        HttpResponse response = client.send(request);
        return response;
    }

    @AuraEnabled(cacheable = true)
    public static List<Pokemon__c> getAllPokemons(){
        List<Pokemon__c> pokemons = [SELECT Name, Pokedex_Number__c, Pokemon_Image_Url__c, Height__c, Weight__c FROM Pokemon__c ORDER BY Pokedex_Number__c ASC];
        return pokemons;
    }
}
