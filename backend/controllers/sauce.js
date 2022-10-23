// const { render } = require('../app');
const Sauce = require('../models/sauce');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;

exports.addSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    // console.log('add sauce', req);
    const sauce = new Sauce({
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      mainPepper: req.body.sauce.mainPepper,
      heat: req.body.sauce.heat,
      userId: req.body.sauce.userId,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    console.log(sauce);
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Sauce added successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};
  
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (Sauces) => {
        res.status(200).json(Sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id
      }).then(
        (sauce) => {
          res.status(200).json(sauce);
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
};

exports.modifySauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId,
        likes: usersLiked.length,
        dislikes: usersDisiked.length,
      };
    } else {
      sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId
      };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'This sauce has been updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};
  
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink('images/' + filename, () => {
            Sauce.deleteOne({_id: req.params.id}).then(
                () => {
                  res.status(200).json({
                    message: 'This sauce has been deleted!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
            });
        }
    );
};

// exports.modifyLikes = (req, res, next) => {
//   Sauce.findOne({_id: req.params.id}).then(
//     (sauce) => {
//       likes = usersLiked.length,
//       dislikes = usersDisliked.length,}

//       if (sauce.likes.filter(likes => usersLiked.user = req.user.id).length > 0) {
//         res.status(200).json({
//         message: 'You have already liked this sauce!'
//         });


//     }
//   )
// }