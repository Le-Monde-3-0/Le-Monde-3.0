import 'package:http/http.dart' as http;

class ProfilService {
  static Future<void> updateProfilePrivacy(bool newValue) async {
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8081/profile'),
        body: {'isPublic': newValue.toString()},
      );

      if (response.statusCode == 200) {
        print('Profil mis à jour avec succès');
      } else {
        print('Erreur lors de la mise à jour du profil');
      }
    } catch (e) {
      print('Erreur lors de la mise à jour du profil: $e');
    }
  }
}
