import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';

import '../models/article_input.dart';
import '../models/article.dart';

class ArticleService {
  final storage = new FlutterSecureStorage();
  final UserBloc userBloc;
  var baseUrl = 'https://anthologia-xwv6huylia-ew.a.run.app';
  // var baseUrl = 'http://20.13.168.88:3000';

  ArticleService({required this.userBloc});

  Future<dynamic> createArticle(ArticleInputModel article) async {
    var token = userBloc.state.user?.token;
    print("darft status: ${article.draft}");
    var url = Uri.parse('${baseUrl}/articles');
    var body = json.encode({"draft": article.draft,
                            "topic": article.topic,
                            "title": article.title,
                            "subtitle": article.subtitle,
                            "content": article.content,
                            "cid": "string"
                            });
    print(body);
    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      print(response.body);
      throw Exception('Impossible de creer cet article');
    }
  }

  Future<List<ArticleModel>> getArticles() async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles');
    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token"
      }
    );
   if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        try {
          articlesList.add(ArticleModel.fromJson(article));
        } catch (e, stackTrace) {
          print('Error parsing article: $e');
          print(stackTrace);
        }
      }
      // print(articlesList);
      return articlesList;
    } else {
      throw Exception('Impossible de recuperer les articles');
    }
  }

  Future<ArticleModel> getArticleById(int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('${baseUrl}/articles/$articleId');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
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
    var token = userBloc.state.user?.token;
    var myId = userBloc.state.user?.id;
    var url = Uri.parse('${baseUrl}/articles/me?draft=false');
    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
    );
    print(response.statusCode);
    print(response.body);
   if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      print(jsonResponse);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        try {
          print('Processing article: $article');
        if (article['draft'] == false) {
          articlesList.add(ArticleModel.fromJson(article));
        }
        } catch (e, stackTrace) {
          print('Error parsing article: $e');
          print(stackTrace);
        }
      }
      print(articlesList);
      return articlesList;
    } else {
      return [];
    }
  }

  Future<List<ArticleModel>> getMyDraftArticle() async {
    var token = userBloc.state.user?.token;
    var myId = userBloc.state.user?.id;
    var url = Uri.parse('${baseUrl}/articles/me?draft=true');
    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
    );
    print(response.statusCode);
    print(response.body);
   if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      print(jsonResponse);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        try {
          print('Processing article: $article');
        if (article['draft'] == true) {
          articlesList.add(ArticleModel.fromJson(article));
        }
        } catch (e, stackTrace) {
          print('Error parsing article: $e');
          print(stackTrace);
        }
      }
      print(articlesList);
      return articlesList;
    } else {
      return [];
    }
  }

  // FAV
  Future<List<ArticleModel>> getFavoriteArticle() async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles?isLiked=true');
    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
    );
   if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        try {
          if (article['draft'] == false) {
            articlesList.add(ArticleModel.fromJson(article));
          }
        } catch (e, stackTrace) {
          print('Error parsing article: $e');
          print(stackTrace);
        }
      }
      return articlesList;
    } else {
      return [];
      // throw Exception('Impossible de recuperer les articles');
    }
  }

  void favArticle(int articleId, bool isLiked) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/${articleId}/like');
    print(articleId);
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: json.encode({
        "isLiked": isLiked,
      }),
    );
    print(response.statusCode);
    print(response.body);
    if (response.statusCode == 200) {

    } else {
      throw Exception('Impossible d\'ajouter cette article aux favoris');
    }
  }

  void unFavArticle(int articleId) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/${articleId}/likes');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      }
    );
    if (response.statusCode == 200) {
    } else {
      throw Exception('Impossible de supprimer cette article des favoris');
    }
  }

  Future<bool> isFavArticle(int articleId) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/liked');

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
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/${articleId}');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      }
    );
    print(response.statusCode);
    print(response.body);
    if (response.statusCode == 200) {

    } else {
      throw Exception('Impossible de supprimer cet article');
    }
  }


  // PUT
  Future<bool> updateArticle(int articleId, ArticleInputModel article) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/${articleId}');
    var body = json.encode({'draft': article.draft,
                            'topic': article.topic,
                            'title': article.title,
                            'subtitle': article.subtitle,
                            'content': article.content});
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
    print(response.statusCode);
    print(response.body);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Impossible de mettre a jour cet article');
    }
  }

  Future ChangeDraftState(int articleId, ArticleModel article, bool draft) async {
    var token = userBloc.state.user?.token;
    var url = Uri.parse('${baseUrl}/articles/${articleId}/');
    var body = json.encode({'draft': draft,
                            'topic': article.topicId,
                            'title': article.title,
                            'subtitle': article.subtitle,
                            'content': article.content});    
    var response = await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $userBloc.state.user?.token",
        "Cookie": "jwt=$token"
      },
      body: body
    );
    print(response.statusCode);
    print(response.body);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Impossible de publier ou mettre au brouillon cette article');
    }
  }

}
