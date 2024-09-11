import 'dart:convert';
import 'dart:ffi';
// import 'dart:ffi';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/article.dart';

class ArticleService {
  final storage = new FlutterSecureStorage();
  var baseUrl = 'http://20.13.168.88';

  Future<dynamic> createArticle(String authorname, String content, String subtitle, String title, String topic, bool draft) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles');
    var body = json.encode({'authorname': authorname, 'content': content, 'draft': draft, 'subtitle': subtitle, 'title': title, 'topic': topic});

    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Impossible de creer cet article');
    }
  }

  Future<List<ArticleModel>> getArticles() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      print(jsonResponse);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
          articlesList.add(ArticleModel.fromJson(article, false));
      }
      return articlesList;
    } else {
      throw Exception('Impossible de recuperer les articles');
    }
  }

  Future<ArticleModel> getArticleById(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles/$articleId');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );

    if (response.statusCode == 200) {
      Map<String, dynamic> jsonResponse = json.decode(response.body); 
      ArticleModel article = ArticleModel.fromJson(jsonResponse);
      return article;
    } else {
      throw Exception('Impossible de recuperer cet article');
    }
  }




  Future<List<ArticleModel>> getMyPublishedArticle() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles/me');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        if (article['Draft'] == false) {
          articlesList.add(ArticleModel.fromJson(article, true));
        }
      }
      return articlesList;
    } else {
      throw Exception('Impossible de recuperer les articles publiés');
    }
  }

  Future<List<ArticleModel>> getMyDraftArticle() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles/me');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        if (article['Draft'] == true) {
          articlesList.add(ArticleModel.fromJson(article, true));
        }
      }
      return articlesList;
    } else {
      throw Exception('Impossible de recuperer les articles en brouillon');
    }
  }

  Future<List<ArticleModel>> getFavoriteArticle() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8080/articles/liked');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        if (article['Draft'] == false) {
          articlesList.add(ArticleModel.fromJson(article, true));
        }
      }
      return articlesList;
    } else {
      throw Exception('Impossible de charger les articles favoris');
    }
  }



  // FAV

  void favArticle(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/${articleId}/likes');

    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {

    } else {
      throw Exception('Impossible d\'ajouter cette article aux favoris');
    }
  }

  void unFavArticle(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/${articleId}/likes');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {
    } else {
      throw Exception('Impossible de supprimer cette article des favoris');
    }
  }

  Future<bool> isFavArticle(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/liked');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );

    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      for (var article in jsonResponse) {
        if (article["Id"] == articleId) {
          return true;
        }
      }
      return false;
    } else {
      throw Exception('Impossible de recuperer les articles favoris');
    }
  }


  // DELETE
  void deleteArticle(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/${articleId}');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    if (response.statusCode == 200) {

    } else {
      throw Exception('Impossible de supprimer cet article');
    }
  }


  // PUT
  Future<bool> updateArticle(int articleId, String content, String subtitle, String title, String topic) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/${articleId}');
    var body = json.encode({'content': content, 'title': title, 'subtitle': subtitle, 'topic': topic});
    var response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Impossible de mettre a jour cet article');
    }
  }

  Future ChangeDraftState(int articleId, bool draft) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}:8082/articles/${articleId}/draft');
    var body = json.encode({'draft' : draft});
    var response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Impossible de publier ou mettre au brouillon cette article');
    }
  }

}
