public with sharing class calloutPokeApi {
	public static final String URL = 'https://pokeapi.co/api/v2/';
    
    @AuraEnabled
    public static List<Object> getAllPokemons(){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(URL + 'pokemon');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        Map<String, Object> results = new Map<String, Object>();
        List<Object> listResponse = new List<Object>();
        Map<String, Object> pokeName = new Map<String, Object>();
        List<String> pokeNameList = new List<String>();
        // If the request is successful, parse the JSON response.
        if(response.getStatusCode() == 200) {         
            // Deserialize the JSON string into collections of primitive data types.
            results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            listResponse = (List<Object>) results.get('results');
        }	
        
        if(!listResponse.isEmpty()){
            for(Object o : listResponse){
                pokeName = (Map<String, Object>) o;
                pokeNameList.add((String) pokeName.get('name'));
            }
        }
        return listResponse;
    }
}