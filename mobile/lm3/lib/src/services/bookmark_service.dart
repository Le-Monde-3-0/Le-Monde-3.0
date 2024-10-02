import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:lm3/src/models/article.dart';
import 'Auth_service.dart';
import 'package:lm3/src/models/bookmark.dart';

class BookmarkService {
  final FlutterSecureStorage storage = FlutterSecureStorage();
  var baseUrl = 'http://20.13.168.88'; // Remplacez par votre IP ou URL correcte

  // Récupérer tous les bookmarks
  Future<List<Bookmark>> getAllBookmarks() async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/topics');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );

    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      return jsonResponse.map((bookmark) => Bookmark.fromJson(bookmark)).toList();
    } else {
      throw Exception('Impossible de récupérer les bookmarks');
    }
  }

  // Créer un bookmark
  Future<Bookmark> createBookmark(String title, String description) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies');
    var body = json.encode({'title': title, 'description': description});

    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body,
    );

    if (response.statusCode == 201) {
      return Bookmark.fromJson(json.decode(response.body));
    } else {
      throw Exception('Impossible de créer le bookmark');
    }
  }

  // Supprimer un bookmark
  Future<void> deleteBookmark(int bookmarkId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies/$bookmarkId');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Impossible de supprimer le bookmakr');
    }
  }

  // Mettre à jour un bookmark
  Future<Bookmark> updateBookmark(int bookmarkId, String title, String description) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies/$bookmarkId');
    var body = json.encode({'title': title, 'description': description});

    var response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: body,
    );

    if (response.statusCode == 200) {
      return Bookmark.fromJson(json.decode(response.body));
    } else {
      throw Exception('Impossible de mettre à jour le topics');
    }
  }

  // Récupérer les articles d'un bookmark
  Future<List<ArticleModel>> getArticlesFromBookmark(int bookmarkId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies/$bookmarkId/articles');

    var response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );

    if (response.statusCode == 200) {
      Iterable jsonResponse = json.decode(response.body);
      return jsonResponse.map((article) => ArticleModel.fromJson(article, false)).toList();
    } else {
      throw Exception('Impossible de récupérer les articles du bookmark');
    }
  }

  // Ajouter un article à un bookmark
  Future<void> addArticleToBookmark(int bookmarkId, int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies/$bookmarkId/articles/$articleId');

    var response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Impossible d\'ajouter l\'article au bookmark');
    }
  }

  // Supprimer un article d'un bookmark
  Future<void> removeArticleFromBookmark(int bookmarkId, int articleId) async {
    var token = await storage.read(key: "token");
    var url = Uri.parse('$baseUrl:8080/anthologies/$bookmarkId/articles/$articleId');

    var response = await http.delete(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Impossible de supprimer l\'article du bookmark');
    }
  }
}
